#pragma strict

var timer : GameObject;
var deaths : GameObject;
var continueText : GameObject;
static var onScreen : boolean = false;

private var delay = false;

function Awake () {
	timer.GetComponent(UI.Text).text = (PlayerScript.CurrentTime().ToString("F2"));
	deaths.GetComponent(UI.Text).text = PlayerScript.deathCount.ToString();
	onScreen = true;
	Delay();
}

function Delay(){
	yield WaitForSeconds (1);
	delay = true;
}

function Update(){
	if(delay){
		continueText.GetComponent(UI.Text).text = "Press any key to continue";		
		
		if(Input.anyKey){
			Application.LoadLevel(PlayerPrefs.GetInt("CurrentLevel"));
			onScreen = false;
		}
	}
}	
