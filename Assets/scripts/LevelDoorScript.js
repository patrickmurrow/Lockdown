#pragma strict

//Should be false if the door is inside the hidden room, true if otherwise
var levelDoor : boolean = true;
var openSound : AudioClip;
var closeSound : AudioClip;

private var anim : Animator;
private var playing : boolean = false;
private var touchingDoor : boolean = false;

function OnTriggerEnter2D(other : Collider2D){
	if(other.gameObject.layer == LayerMask.NameToLayer("Player")){
		touchingDoor = true;
	}
}

function OnTriggerExit2D(other : Collider2D){
	if(other.gameObject.layer == LayerMask.NameToLayer("Player")){
		touchingDoor = false;
	}
}

function Start () {
	anim = GetComponent(Animator);
}

function Update () {
	if(Input.GetButtonDown("Open") && !playing && touchingDoor){
		if(levelDoor != PlayerScript.showHiddenRooms)
			OpenDoor(true);
		else
			OpenDoor(false);
	}
}

function OpenDoor(changeLevel : boolean){
	playing = true;
	anim.SetTrigger("OpenDoor");
	PlayerScript.openingDoor = true;
	PlayerScript.canMove = false;
	PlayerScript.player.audio.clip = openSound;
	PlayerScript.player.audio.Play();
	yield WaitForSeconds(1);
	
	touchingDoor = false;
	PlayerScript.canMove = true;
	if(changeLevel)
		PlayerScript.showHiddenRooms = levelDoor;
	yield WaitForSeconds(0.1);
	PlayerScript.player.audio.clip = closeSound;
	PlayerScript.player.audio.Play();
	playing = false;
	PlayerScript.openingDoor = false;
}