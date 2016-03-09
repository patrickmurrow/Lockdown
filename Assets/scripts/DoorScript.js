#pragma strict

private var anim : Animator;
private var isOpen : boolean = false;
private var playing : boolean = false;
private var showText : boolean = false;

var keyCardText : GameObject;
var openSound : AudioClip;
var lockedSound : AudioClip;

function Start () {
	anim = gameObject.GetComponent(Animator);
	keyCardText = GameObject.Find("KeyCardText");
}

function Update () {
	keyCardText.SetActive(showText);

	if(isOpen && !playing){
		anim.SetTrigger("DoorOpen");
		gameObject.layer = LayerMask.NameToLayer("TriggerObject");
		audio.clip = openSound;
		audio.Play();
		playing = true;
	}
}

function OnTriggerEnter2D(other : Collider2D){
	if(other.gameObject.layer == LayerMask.NameToLayer("Player") && !isOpen && PlayerScript.hasKeyCard){
		isOpen = true;
		PlayerScript.hasKeyCard = false;
	} else if(other.gameObject.layer == LayerMask.NameToLayer("Player") && !PlayerScript.hasKeyCard && !isOpen){
		ShowText();
	}
}

function ShowText(){
	if(!showText){
		showText = true;
		audio.clip = lockedSound;
		audio.Play();
		yield WaitForSeconds(1);
		showText = false;
	}
}