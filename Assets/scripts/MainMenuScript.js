#pragma strict

var selectSound : AudioClip;
var hoverSound : AudioClip;
var paperSound : AudioClip;
var buttons : GameObject;
var loadLevel : boolean = false;

private var currentLevel : int;
private var menuAnim : Animator;
private var controls : GameObject;
private var cameraAudio : AudioSource;
private var loading : boolean = false;
private var showControls : boolean = false;
private var fading : boolean = false;

function Awake(){
	if(PlayerPrefs.GetInt("CurrentLevel") == null){
		PlayerPrefs.SetInt("CurrentLevel", 1);
	}
	loading = false;
	cameraAudio = GameObject.Find("Audio Listener").GetComponent(AudioSource);
	cameraAudio.volume = 1;
	menuAnim = GameObject.Find("Main Menu UI").GetComponent(Animator);
	controls = GameObject.Find("Controls UI");
	Screen.showCursor = true;
	controls.SetActive(false);
	
	if (Application.isWebPlayer) {
		//Hide the quit button if playing on web build
		buttons.transform.Find("Quit").gameObject.SetActive(false);
	}
}

function Update(){
	currentLevel = PlayerPrefs.GetInt("CurrentLevel");
	if(currentLevel == 0)
		PlayerPrefs.SetInt("CurrentLevel", 1);
		
		if(Input.GetButtonDown("Cancel") && !fading && showControls){
			ShowControls(!showControls);
		}
}

function ShowControls(active : boolean){
	if(!fading){
		controls.SetActive(active);
		showControls = active;
		buttons.GetComponent(CanvasGroup).interactable = !active;
		if(active){
		cameraAudio.Stop();
			cameraAudio.clip = paperSound;
			cameraAudio.Play();
		}
	}
}

function NewGame(){
	FadeOut();
	  
    PlayerPrefs.SetInt("CurrentLevel", 1);
    currentLevel = 1;
    LoadLevel(5);	
}

function Continue(){
	FadeOut();
	LoadLevel(currentLevel);
}

function FadeOut(){
	menuAnim.SetTrigger("FadeOut");
	fading = true;
}


function LoadLevel(level : int){
	MouseSelect();
	Screen.lockCursor = true;
	yield WaitForSeconds(3);
	fading = false;
	Screen.lockCursor = false;
	Screen.showCursor = false;
	Application.LoadLevel(level);
}

function MouseHover(){
	//AudioSource.PlayClipAtPoint(hoverSound, Camera.main.transform.position); 
	if(!loading && !showControls){
		cameraAudio.Stop();
		cameraAudio.clip = hoverSound;
		cameraAudio.Play();
	}
}

function MouseSelect(){
	//AudioSource.PlayClipAtPoint(selectSound, Camera.main.transform.position);
	cameraAudio.Stop();
	loading = true;
	cameraAudio.volume = 0.6;
	cameraAudio.clip = selectSound;
	cameraAudio.Play();
}

function Quit(){
	Application.Quit();
}