#pragma strict

var paperNumber : int;

// Rate of the 'bob' movement
var bobRate: float = 2;
// Scale of the 'bob' movement
var bobScale: float = 0.0025;

//How close to the paper on the z axis the player has to be to trigger picking up the paper
var distanceThreshold : float = 10;

function Start () {

}

function FixedUpdate () {
	// Change in vertical distance 
	var dy : float = bobScale * Mathf.Sin(bobRate*Time.time);

	// Move the game object on the vertical axis
	transform.Translate(new Vector3(0,dy,0));
}

function OnTriggerEnter2D(other : Collider2D) {
	var otherZ = other.gameObject.transform.position.z;
	if (other.gameObject.layer == LayerMask.NameToLayer("Player") && Mathf.Abs(otherZ - transform.position.z) < distanceThreshold) {
		PlayerScript.paperNumber = paperNumber; 
		PlayerScript.touchingPaper = true;
	}
}

function OnTriggerExit2D(other : Collider2D) {
	var otherZ = other.gameObject.transform.position.z;
	if (other.gameObject.layer == LayerMask.NameToLayer("Player") && Mathf.Abs(otherZ - transform.position.z) < distanceThreshold) {
		PlayerScript.touchingPaper = false;
	}
}