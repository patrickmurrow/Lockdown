#pragma strict

var mainCamera : GameObject;
var levelContainer : GameObject;
//If true, everything in the background will be disabled(paused) when you
//enter a hidden room
var fullHide : boolean = true;
var hiddenRoomPlatformLayer : LayerMask = -1;
var hiddenRoomTriggerLayer : LayerMask = -2;
var roomAudio : AudioClip;
static var inside : boolean = false;

private var tempPM : LayerMask;
private var tempTM : LayerMask;

private var player : GameObject;
private var cController : CharacterController2D;
private var levelLights : GameObject;

function Start () {
	mainCamera = Camera.main.gameObject;
	player = GameObject.Find("Player");
	cController = player.GetComponent(CharacterController2D);
	levelLights = GameObject.Find("Lights");
	
	tempPM = cController.platformMask;
	tempTM = cController.triggerMask;
	
}

function Update () {
	if(PlayerScript.showHiddenRooms){
		ShowRooms(true);
		mainCamera.transform.position.z = -30;
		player.transform.position.z = -20.01;
	}
	else{
		ShowRooms(false);
		mainCamera.transform.position.z = -10;
		player.transform.position.z = -0.01;
	}


}

function ShowRooms(showRooms : boolean){		
	/*for(var temp : Transform in transform){
		temp.gameObject.SetActive(showRooms);
	}*/

	if(fullHide){
		for(var temp : Transform in levelContainer.transform){
			temp.gameObject.SetActive(!showRooms);
		}
	} else{
		//disable level lights
		//change player tag/layer
		//change player layermask collisions
			levelLights.SetActive(!showRooms);	
		
		if(showRooms){
			//player.layer = LayerMask.NameToLayer("Default");
			player.tag = null;
			PlayerScript.detectionLevel = 0f;
			PlayerScript.isLight = false;
			cController.platformMask = hiddenRoomPlatformLayer;
			cController.triggerMask = hiddenRoomTriggerLayer;
			inside = false;
		} else{
			//player.layer = LayerMask.NameToLayer("Player");
			player.tag = "Player";			
			cController.platformMask = tempPM;
			cController.triggerMask = tempTM;
			//audio.clip = roomAudio;
			//audio.Play();
			inside = true;
		}
	}
}