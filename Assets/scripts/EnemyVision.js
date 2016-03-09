#pragma strict

var singleRayVision : boolean = true;
var rayCount : int = 8;
var fieldOfView : float = 90f;
//Distance enemy can see player when the player is in the dark.
var darkViewDistance : float = 3f;
//Distance enemy can see the player when the player is in the light
var lightViewDistance : float = 5f;

var startRayX : float = 0f;
var startRayY : float = 0f;

var visionMask : LayerMask; //The layers this object will see.

var canSeePlayer: boolean;

var playerTransform : Transform;

//The direction the enemy is looking.
var viewDirection : Vector2 = -Vector2.right;

function Start () {

}

function FixedUpdate () {
	if (PlayerScript.isHidden || PlayerScript.finishedLevel) {
		return; //Dont' bother drawing rays
	}
	if (singleRayVision) {
		lookSingleRay(viewDirection);
	} else {
		lookMultiRay();
	} 
}

function lookSingleRay(lookDirection : Vector2) {
	var startRayVector = transform.position + Vector3(startRayX, startRayY, 0);
	var hit : RaycastHit2D = Physics2D.Raycast(startRayVector, lookDirection, lightViewDistance, visionMask);
	Debug.DrawLine(startRayVector, (transform.position + lookDirection * lightViewDistance), Color.red);
	if(hit.collider != null && !PlayerScript.showHiddenRooms && hit.collider.gameObject.layer == LayerMask.NameToLayer("Player")) {
		playerTransform = hit.collider.gameObject.transform;
		var distanceToPlayer = Vector2.Distance(gameObject.transform.position, hit.collider.gameObject.transform.position);
		var playerPosition = hit.collider.gameObject.transform.renderer.bounds.center;
		if (PlayerScript.isLight) {
			canSeePlayer = true;			
			changeDirection(playerPosition - transform.position);
			//Debug.Log("Saw player in the light");
		} else if (distanceToPlayer < darkViewDistance) {
			canSeePlayer = true;
			changeDirection(playerPosition - transform.position);
			//Debug.Log("Saw player in the dark");
		} else {
			canSeePlayer = false;
		}
	} else {
		canSeePlayer = false;
	}
}

function lookMultiRay() {
	var angleBetweenRays : float = fieldOfView / rayCount;
	for (var i = -(rayCount / 2); i < rayCount / 2; i++) {
		var rotation = Quaternion.Euler(0, 0, angleBetweenRays * i);
		var rayDirection = rotation * viewDirection;
		lookSingleRay(rayDirection);
		if (canSeePlayer) {
			return; //Otherwise we might unset canSeePlayer with the next ray.
		}
	}
}

//TODO this instantly changes view direction. It should take a moment to move around.
function changeDirection(newDirection : Vector2) {
	viewDirection = newDirection.normalized;
}