#pragma strict

private var stealthCollider : CircleCollider2D;

var player : GameObject;
var colliderRunSize : float = 1f;
var colliderSneakSize : float = 0.4f;
var colliderWalkSize : float = 0.6f;
var colliderIdleSize : float = 0.2f;

function Start () {
	stealthCollider = gameObject.AddComponent(CircleCollider2D);
	stealthCollider.isTrigger = true;
}

function Update () {
	gameObject.transform.position = player.transform.position;

	if(PlayerScript.onLadder){
		stealthCollider.radius = colliderIdleSize;
	}
	else if(PlayerScript.isRunning && PlayerScript.isSneaking && PlayerAnimScript.grounded){
		stealthCollider.radius = colliderSneakSize;
	}
	else if(PlayerScript.isRunning && PlayerScript.isSprinting && PlayerAnimScript.grounded){
		stealthCollider.radius = colliderRunSize;
	}
	else if(PlayerScript.isRunning && PlayerAnimScript.grounded){
		stealthCollider.radius = colliderWalkSize;
	}
	
	else{
		stealthCollider.radius = colliderIdleSize;
	}
	
}