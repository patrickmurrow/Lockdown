#pragma strict

var guard1 : GameObject;

//How long after the scene is loading to begin the conversation.
var startConvoDelay : float;

var guard1Text : UI.Text;
var help : UI.Text;
var player : GameObject; //So I can add a time delay
var door : GameObject;
private var menuAnim : Animator;

function Start () {
	
	var door = GameObject.Find("Door").GetComponent(BoxCollider2D);
	door.GetComponent(LevelDoorScript).enabled = false;
	menuAnim = GameObject.Find("Cutscene UI").GetComponent(Animator);
	help.text = "";
	yield;
	FadeOut();
	PlayerScript.inCutScene = true;
	PlayerScript.canMove = false;
	player.GetComponent(PlayerAnimScript).movementDir = -1;
	yield;
	player.GetComponent(PlayerAnimScript).enabled = false;
	talk();
}

function Update () {
	if (PlayerScript.readingPaper) {
		door.GetComponent(LevelDoorScript).enabled = true;
	}
	if (PlayerScript.openingDoor) {
		LoadLevel();
	}
}

function talk() {
	yield WaitForSeconds(startConvoDelay);
	PlayerScript.isTalking = true;
	guard1Text.text = "Wake up";
	yield WaitForSeconds(2);
	guard1Text.text = "Here's how this is going to work";
	yield WaitForSeconds(3);
	guard1Text.text = "You are going to serve the remainder of your brother's sentence";
	yield WaitForSeconds(4);	
	guard1Text.text = "He had eight more years.";
	yield WaitForSeconds(2);
	guard1Text.text = "But we can get you out on home detention in six.";
	yield WaitForSeconds(3);
	guard1Text.text = "Just play along and things will be easy for you here.";
	yield WaitForSeconds(3);
	guard1Text.text = "If you make trouble...";
	yield WaitForSeconds(2);
	guard1Text.text = "Don't make trouble.";
	yield WaitForSeconds(2);
	guard1Text.text = "Breakfast is in six hours.";
	yield WaitForSeconds(2);
	guard1Text.text = "";
	yield WaitForSeconds(2);
	Destroy(guard1);
	//Solidifies the door so that the player can't pass through it
	GameObject.Find("DoorCollider").GetComponent(BoxCollider2D).enabled = true;
	PlayerScript.inCutScene = false;
	PlayerScript.canMove = true;
	PlayerScript.isTalking = false;
	player.GetComponent(PlayerAnimScript).enabled = true;
	help.text = "WASD to move. \n Press W to interact with objects.";
	yield WaitForSeconds(4);
	help.text = "";
	yield WaitForSeconds(15);
	help.text = "Press W or Up Arrow Key to pick up notes";
	yield WaitForSeconds(4);
	help.text = "";
}

function FadeOut(){
	menuAnim.SetTrigger("FadeOut");
}

function LoadLevel() {
	yield WaitForSeconds(.5); //So the animation plays
	PlayerScript.canMove = true;
	PlayerScript.firstTry = true;
	PlayerScript.finishedLevel = true;
	PlayerPrefs.SetInt("CurrentLevel", 1);
	PlayerScript.openingDoor = false;
	Application.LoadLevel("Level 1");
}