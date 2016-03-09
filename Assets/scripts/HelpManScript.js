#pragma strict

var textBox : GameObject;
var mainAudio : AudioClip;
//var play : boolean = true;

private var text : UI.Text;

function Start () {
	text = textBox.GetComponent(UI.Text);
}

function Update () {
//	if (HiddenRoomScript.inside){
//		audio.clip = mainAudio;
//		audio.Pause();
//		play  = true;
//	}else if(play){
//		audio.clip = mainAudio;
//		audio.volume = 0.2;
//		audio.Play();
//		play = false;
//	}
}

function OnTriggerEnter2D(other : Collider2D){
	//Debug.Log("Collided with " + other.name);
	if(other.gameObject.layer == LayerMask.NameToLayer("Player") && !PlayerScript.hasTalked && PlayerScript.showHiddenRooms){
		TalkToPlayer();
		//audio.clip = mainAudio;
		//audio.Play();
		
	}
}

function TalkToPlayer(){
	LevelMusic.playH = true;
	PlayerScript.hasTalked = true;
	text.text = "Jordan?!?";
	yield WaitForSeconds(1);
	text.text = "Hold on. You must be his brother.";
	yield WaitForSeconds(2);
	text.text = "The guards put you in his place!";
	yield WaitForSeconds(2);
	text.text = "And now you're following his escape plan!";
	yield WaitForSeconds(2);
	text.text = "Well he used a slingshot to get out.";
	yield WaitForSeconds(2);
	text.text = "You can have my spare.";
	yield WaitForSeconds(1.5);
	text.text = "";
	PlayerScript.hasSlingShot = true;
	LevelMusic.playH = false;

}