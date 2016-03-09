#pragma strict

var stealthIcon : GameObject;
var detectedIcon : GameObject;
var endLevelScreen : GameObject;
var pauseScreen : GameObject;

var paperSound : AudioClip;

var eye1 : GameObject;
var eye2 : GameObject;
var eye3 : GameObject;
var eye4 : GameObject;
var eye5 : GameObject;

var rockIcon : GameObject = null;
var ammoCount : GameObject = null;
var timer : GameObject = null;

var papers : UnityEngine.UI.Image[];

private var visible : boolean;

static var detected : boolean = false;

function Start() {
	if(ammoCount != null)
		ammoCount.GetComponent(UI.Text).text = "x " + PlayerScript.ammo;
	//Debug.Log(ammoCount);
}

function Update () {
	visible = PlayerScript.isLight;
	
	for (var i = 0; i < papers.Length; i++) {
		papers[i].gameObject.SetActive(PlayerScript.readingPaper && i == PlayerScript.paperNumber);
	}
	
	if(PlayerScript.showPauseScreen){
		AudioSource.PlayClipAtPoint(paperSound, PlayerScript.player.transform.position);
		Time.timeScale = 0;
		Screen.showCursor = true;
		pauseScreen.SetActive(true);
	} else{
		pauseScreen.SetActive(false);
		Time.timeScale = 1;
		Screen.showCursor = false;
	}
	
	if(stealthIcon != null){
		if(visible){
			stealthIcon.SetActive(true);
		} else{
			stealthIcon.SetActive(false);
		}
	}
	
	if(timer != null)
		timer.GetComponent(UI.Text).text = PlayerScript.currentTime.ToString("F2");
	if(eye5 != null){
		if(PlayerScript.detectionLevel >= 5){
			eye5.SetActive(true);
		} else eye5.SetActive(false);
		if(PlayerScript.detectionLevel >= 4){
			eye4.SetActive(true);
		} else eye4.SetActive(false);
		if(PlayerScript.detectionLevel >= 3){
			eye3.SetActive(true);
		} else eye3.SetActive(false);
		if(PlayerScript.detectionLevel >= 2){
			eye2.SetActive(true);
		} else eye2.SetActive(false);
		if(PlayerScript.detectionLevel >= 1){
			eye1.SetActive(true);
		} else eye1.SetActive(false);
	}
	
	if(ammoCount != null)
		ammoCount.GetComponent(UI.Text).text = "x " + PlayerScript.ammo;
		
	if(rockIcon != null){
		if(PlayerScript.hasSlingShot){
			rockIcon.SetActive(true);
			ammoCount.SetActive(true);
		} else{
			rockIcon.SetActive(false);
			ammoCount.SetActive(false);
		}
	}
	
	if(PlayerScript.finishedLevel){
		ShowEndScreen();
	}	
}

function ShowEndScreen(){
	endLevelScreen.SetActive(true);
}