#pragma strict

var noiseColliderRadius : float;
var breakSound : AudioClip = null;
var offSprite : Sprite;
var offMaterial : Material;

private var broken = false;
private var spot : Transform;

function Start () {
 	spot = transform.GetChild(0);
}

function Update () {

}

function OnCollisionEnter2D(other : Collision2D) {
	if (broken) {
		return;
	}
	broken = true;
	//This yield means that if this object hits another BreakableObject, it has a chance to break too.
	yield;
	//Debug.Log("Collided with " + other.gameObject);
	Debug.Log("Name: " + gameObject.name + ", Tag: " + gameObject.tag);
	//if(LayerMask.LayerToName(gameObject.layer) == "Light"){
		if(breakSound != null)	
			AudioSource.PlayClipAtPoint(breakSound, transform.position); 
	//}
	PlayerScript.isLight = false;
	var noiseObject : GameObject = new GameObject();
	noiseObject.transform.position = transform.position;
	noiseObject.layer = LayerMask.NameToLayer("SoundColliders");
	var noise = noiseObject.AddComponent(CircleCollider2D);
	noise.isTrigger = true;
	noise.radius = noiseColliderRadius;
	//maybe instantiate a broken sprite.
	if (gameObject.CompareTag("Light")) {
		//We have to do this because a trigger exit event won't be created when we destroy it.
		//If the player is in a different light, it should become light again very quickly.
		PlayerScript.isLight = false;
	}
	if (gameObject.CompareTag("PlayerShot")){
		UnityEngine.Object.Destroy(gameObject);
	}
	else {
		Destroy(spot.gameObject);
		gameObject.GetComponent(SpriteRenderer).sprite = offSprite;
		gameObject.GetComponent(SpriteRenderer).material = offMaterial;
		}
	UnityEngine.Object.Destroy(noiseObject.gameObject, 0.1);
	//UnityEngine.Object.Destroy(gameObject);
	
}


