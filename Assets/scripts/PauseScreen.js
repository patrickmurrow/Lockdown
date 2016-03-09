#pragma strict

function Awake() {
}

function Update () {
}

function Resume(){
	PlayerScript.showPauseScreen = false;
}

function Quit(){
	Resume();
	Application.LoadLevel("Main Menu");
}

function Restart(){
	PlayerScript.deathCount++;
	Resume();
	Application.LoadLevel(PlayerPrefs.GetInt("CurrentLevel"));
}