#pragma strict

var guard1 : GameObject;

//How long after the scene is loading to begin the conversation.
var startConvoDelay : float;

var guard1Text : UI.Text;
var blackScreen : GameObject;
private var menuAnim : Animator;

function Start () {
	blackScreen.GetComponent(SpriteRenderer).color = new Color(1f, 1f, 1f, 0f);
	guard1.renderer.enabled = false;
	talk();
}

function Update () {
	if(Input.GetButton("Cancel")){
		Application.LoadLevel("cutscene 3");
	}
}

function talk() {
	PlayerScript.isTalking = true;
	yield WaitForSeconds(5);
	guard1.renderer.enabled = true;
	yield WaitForSeconds(startConvoDelay);
	Debug.Log("talking");
	guard1Text.text = "Hello Alijah";
	yield WaitForSeconds(2);
	
	guard1Text.text = "";
	cutToBlack();
	yield WaitForSeconds(3);
	Application.LoadLevel(7);
}

function cutToBlack(){
	blackScreen.GetComponent(SpriteRenderer).color = new Color(0f, 0f, 0f, 1f);
	audio.Play(); //Play punch sound
}