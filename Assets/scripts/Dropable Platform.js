#pragma strict

var offSprite : Sprite;
var dropSound : AudioClip = null;
var guard : GameObject;
var gun : GameObject;
var droppingGun : boolean = false;

private var broken : boolean = false;

function Start () {

}

function Update () {

}

function OnTriggerEnter2D(other : Collider2D) {
	if (other.gameObject.tag != "PlayerShot") {
		return;
	}
	if(dropSound != null && !broken){
		audio.clip = dropSound;
		audio.Play();
		if(droppingGun){
			guard.GetComponent(GuardScript).hasGun = false;
			guard.GetComponent(EnemyVision).enabled = false;
			gun.GetComponent(MinigunFollow).enabled = false;
		}
	}
	broken = true;
	Destroy(gameObject.GetComponent(HingeJoint2D));
	Destroy(other.gameObject);
	gameObject.GetComponent(SpriteRenderer).sprite = offSprite;
}