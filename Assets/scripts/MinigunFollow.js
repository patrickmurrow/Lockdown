#pragma strict

var target : Transform;
var guard : GameObject;

function Start(){
	
}

function Update () {
	if(guard.GetComponent(EnemyVision).canSeePlayer){
		target = PlayerScript.player.transform;
		var newRotation : Quaternion = Quaternion.LookRotation(transform.position - target.position, -Vector3.right);
    	newRotation.x = 0.0;
    	newRotation.y = 0.0;
    	transform.rotation = newRotation;
    }
}