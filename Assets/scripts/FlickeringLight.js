#pragma strict

var flickerSound : AudioClip;
var onSprite : Sprite = null;
var offSprite : Sprite = null;
var onTime : float;
var offTime : float;
var flickerTime : float;
var flickerCount : int;
var listener : Transform;

private var isOn : boolean;
private var thisLight : Light;
private var lightCollider : Collider2D;
private var timeWhenSwitched : float = 0;

function Start () {
	thisLight = gameObject.GetComponent(Light);
	lightCollider = gameObject.GetComponentInChildren(Collider2D);
	if(flickerSound != null && listener != null){
		audio.PlayClipAtPoint(flickerSound, listener.position);
	}
}

function Update () {
	var switchTime = isOn ? onTime : offTime;
	if (Time.time > timeWhenSwitched + switchTime) {
		flickerThenChange();
		timeWhenSwitched = Time.time;
	}	
}

//Flickers the lights the given amount of times then switches them.
function flickerThenChange() {
	var currentFlickers : int = 0;
	while (currentFlickers < flickerCount) {
		toggleLights();
		yield WaitForSeconds(flickerTime);
		toggleLights();
		yield WaitForSeconds(flickerTime);
		currentFlickers++;
	}
	toggleLights();
	if (!isOn){
		if(flickerSound != null && listener != null){
			audio.PlayClipAtPoint(flickerSound, listener.position);
		}
	}
}

function toggleLights() {
		isOn = !isOn;
		thisLight.enabled = !thisLight.enabled;
		lightCollider.enabled = !lightCollider.enabled;
		if(onSprite != null){
			var newSprite : Sprite = isOn ? offSprite : onSprite;
			transform.parent.gameObject.GetComponent(SpriteRenderer).sprite = newSprite;
		}
}
