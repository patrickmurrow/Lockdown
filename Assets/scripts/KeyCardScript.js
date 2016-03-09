#pragma strict

// Rate of the 'bob' movement
var bobRate: float = 2;
// Scale of the 'bob' movement
var bobScale: float = 0.0025;
var pickupSound : AudioClip;

function Start () {

}

function FixedUpdate () {
	// Change in vertical distance 
	var dx : float = bobScale * Mathf.Sin(bobRate*Time.time);

	// Move the game object on the vertical axis
	transform.Translate(new Vector3(dx,0,0));
}

function OnTriggerEnter2D(other : Collider2D){
	//Debug.Log("Collided with " + other.name);
	if(other.gameObject.layer == LayerMask.NameToLayer("Player")){
		PlayerScript.hasKeyCard = true;
		audio.clip = pickupSound;
		audio.Play();
		
		renderer.enabled = false;
		yield WaitForSeconds(1);
		
		Destroy(gameObject);
	}
}
