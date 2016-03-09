#pragma strict

var walkUpLadder : boolean = false;
var walkDownLadder : boolean = false;
var ladderSize : int = 5;
var endNode : GameObject = null;
var wait : boolean = false;
var waitTime : float = 0f;

var ladderScript : WalkUpLadder = null;


function Start () {
	
	if(walkUpLadder && walkDownLadder){
		walkDownLadder = false;
	}
}

function Update () {

}

function Run(guard : GameObject){
	var startPos_y : float = guard.transform.position.y;
	var guardScript = guard.GetComponent(GuardScript);
	//var done : boolean = false;
	//ladderanim
	if(wait && !guardScript.isWaiting){
		guardScript.isWaiting = true;
		yield WaitForSeconds(waitTime);
		guardScript.isWaiting = false;
	}
	if(walkUpLadder){
		if(endNode.GetComponent(WalkUpLadder) == null){
			if(gameObject.GetComponent(WalkUpLadder) == null){
				gameObject.AddComponent(WalkUpLadder);
			}
			ladderScript = gameObject.GetComponent(WalkUpLadder);
			ladderScript.startMarker = gameObject.transform;
			ladderScript.endMarker = endNode.transform;
			ladderScript.target = guard.transform;
		}
	}
	else if(walkDownLadder){
		// Make sure we're not already moving up the ladder
		if(endNode.GetComponent(WalkUpLadder) == null){
			if(GetComponent(WalkUpLadder) == null){
				gameObject.AddComponent(WalkUpLadder);
				ladderScript = gameObject.GetComponent(WalkUpLadder);
				ladderScript.startMarker = gameObject.transform;
				ladderScript.endMarker = endNode.transform;
				ladderScript.target = guard.transform;
			}
		}
	}
}