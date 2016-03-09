#pragma strict

var guard1TextBox : GameObject;
var guard2TextBox : GameObject;
var guard3TextBox : GameObject;

var guard3Object : GameObject;

//How long after the scene is loading to begin the conversation.
var startConvoDelay : float;

private var guard1 : UI.Text;
private var guard2 : UI.Text;
private var guard3 : UI.Text;
private var menuAnim : Animator;

function Start () {
	guard3Object.renderer.enabled = false;
	menuAnim = GameObject.Find("Cutscene UI").GetComponent(Animator);
	guard1 = guard1TextBox.GetComponent(UI.Text);
	guard2 = guard2TextBox.GetComponent(UI.Text);
	guard3 = guard3TextBox.GetComponent(UI.Text);
	talk();
}

function Update () {
	if(Input.GetButton("Cancel")){
		Application.LoadLevel("cutscene 2 proto");
	}
}

function talk() {
	yield WaitForSeconds(startConvoDelay);
	Debug.Log("talking");
	guard2.text = "How did this happen?";
	yield WaitForSeconds(3);
	guard2.text = "";
	guard1.text = "We don't know. His cell was still locked.";
	yield WaitForSeconds(2);
	guard1.text = "None of the inmates will admit to knowing anything.";
	yield WaitForSeconds(3);
	guard3Object.renderer.enabled = true;
	guard1.text = "There are a few broken lights around, but nothing else.";
	yield WaitForSeconds(3);
	guard1.text = "";
	guard2.text = "%#*%$! This is the third escape in six months!";
	yield WaitForSeconds(2);
	guard2.text = "They'll shut us down for sure.";
	yield WaitForSeconds(2);
	guard2.text = "";
	guard1.text = "What are we going to do?";
	yield WaitForSeconds(2);
	guard1.text = "";
	guard3.text = "I know what to do.";
	yield WaitForSeconds(3);
	guard3.text = "Jordan has a identical twin brother.";
	yield WaitForSeconds(3);
	guard3.text = "He visits every month...";
	yield WaitForSeconds(3);
	
	guard1.text = "";
	guard2.text = "";
	guard3.text = "";
	FadeOut();
	yield WaitForSeconds(4);
	NextLevel();
}

function FadeOut(){
	menuAnim.SetTrigger("FadeOut");
}

function NextLevel(){
	Application.LoadLevel(6);
}