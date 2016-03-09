#pragma strict

// Rate of the 'bob' movement
var bobRate: float = 2;
// Scale of the 'bob' movement
var bobScale: float = 0.0025;
var ammoAmount : int = 5;

function Start () {

}

function FixedUpdate () {
	// Change in vertical distance 
	var dy : float = bobScale * Mathf.Sin(bobRate*Time.time);

	// Move the game object on the vertical axis
	transform.Translate(new Vector3(0,dy,0));
}

function OnTriggerEnter2D(other : Collider2D){
	//Debug.Log("Collided with " + other.name);
	if(other.gameObject.layer == LayerMask.NameToLayer("Player")){
		PlayerScript.ammo += ammoAmount;
		//PlaySound
		Destroy(gameObject);
	}
}
