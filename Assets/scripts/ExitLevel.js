#pragma strict

var levelNumber : int = 0;

function Update () {
	if (Input.GetKey(KeyCode.N)){
		PlayerScript.enableRenderer = false;
		LoadLevel();
	}
}

function OnTriggerEnter2D(other : Collider2D){
	if(other.gameObject.layer == LayerMask.NameToLayer("Player")){
		//other.renderer.enabled = false;
		PlayerScript.enableRenderer = false;
		LoadLevel();
	}
}

function LoadLevel(){
	//If player is not in the process of dying
	if(!PlayerScript.beingHit){
		PlayerScript.canMove = false;
		PlayerScript.openingDoor = true;
		PlayerScript.finishedLevel = true;
		yield WaitForSeconds(0.5);
		PlayerScript.openingDoor = false;
		PlayerScript.canMove = true;
		PlayerScript.firstTry = true;
		PlayerPrefs.SetInt("CurrentLevel", levelNumber);
	}
}