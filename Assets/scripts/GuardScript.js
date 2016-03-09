#pragma strict

var gruntSounds : AudioClip[];
var dieSound : AudioClip;
var shootSound : AudioClip = null;
var playerMask : LayerMask;
var hearingMask : LayerMask; //The layers which block a line of hearing to the guard.
var alertMoveSpeed : float = 4; //How fast the guard moves when alert.
var patrolMoveSpeed : float = 2; //How fast the guard moves normally.
private var moveSpeed :float = 2; //How fast the guard is moving now.
// Sets how close the guard has to be to the current node before he can move to the next node
var moveBuffer : float = 0.2;
var newNode : GameObject;
var detectSpeed : float = 0.1; //How fast the guards detect the player after seeing them
static var cooldownSpeed : float = 0.05; //How fast the guards will lose interest in the player
var killDistance : float = 1f; //How close the player has to be to die
var patrolNodes : GameObject;
var hasGun : boolean = false;
var waitTime : float = 2.0; //How long the guard will wait at a node it is investigating.
var isWaiting : boolean = false;
var startingNode : int = 0;
var debug : boolean = false;
var onLadder : boolean = false;
static var ground : boolean = false;
/*/** Character Controller Vars
var gravity : float = -25f;
var runSpeed : float = 8f;
var groundDamping : float = 20f; // how fast do we change direction? higher means faster

private var normalizedHorizontalSpeed : float = 0f;
private var velocity : Vector3;
//** End of Character Controller Vars */

private var nodes : GameObject[];
private var nodeSize : int;
private var atNode : boolean = false;
private var currentNode : int = 0;
// How much currentNode is changed each time the guard reaches a node
private var changeNode : int = 1;
private var controller;
private var nodeScript : NodeScript;
 var alert : boolean = false;
private var alertNode : boolean = false;
 var currentNodeObject : GameObject;
private var enemyVisionScript : EnemyVision;
private var player : GameObject;
private var isHurt : boolean = false;
private var cController : CharacterController2D;
private var guardController : CharacterController2D;
private var shooting : boolean = false;

private var speed : float = 1f; //For calculating when guard gets stuck.
private var strike : int = 0;
private var lastPosition : Vector3 = Vector3.zero;
private var zPos : float = 0;
private var finishWaitTime : float; //When the guard will have finished waiting.

//The distance before an obstacle a guard will move to when trying to reach an inaccessable node.
private var stopDistance : float = 0.8;
var detectLevel : float = 0f;

function Start () {
	//controller = GetComponent("CharacterController2D");
	//velocity = controller.velocity;
	
	zPos = transform.position.z;
	enemyVisionScript = GetComponent(EnemyVision);
	player = GameObject.Find("Player");
	//Debug.Log(player.name);
	cController = player.GetComponent(CharacterController2D);
	guardController = GetComponent(CharacterController2D);
	
	nodeSize = 0;
	nodes = new Array(patrolNodes.transform.childCount);
	for (var i : int = 0; i < nodes.length; i++) {
    	nodes[nodeSize++] = patrolNodes.transform.GetChild(i).gameObject;
	}
	for(var node : GameObject in nodes){
		nodes[currentNode].name = ("Node " + currentNode);
		currentNode++;
	}
	currentNode = startingNode;
	
	//Guards with no move speed need told to look in the right direction
	//once at the start.
	yield;
	if (patrolMoveSpeed == 0) {
		var nodeLocation = currentNodeObject.transform.GetChild(0).transform.position - transform.position;		
		GetComponent(EnemyVision).changeDirection(nodeLocation);
	}
}

function Update () {
	transform.position.z = zPos;

	if(enemyVisionScript.canSeePlayer){
		//Debug.Log("Can See Player");
		if(!PlayerScript.showHiddenRooms)
			SeePlayer(player.collider2D);
	}

	var offset = player.transform.position - transform.position;
	var sqrLen = offset.sqrMagnitude;
	//Debug.Log(sqrLen);
	if (sqrLen < killDistance && !PlayerScript.isHidden) {
		HurtPlayer();
	}

	if(!atNode && currentNode < nodeSize){
		if(!alert){
			currentNodeObject = nodes[currentNode];
		}
		
		moveToNode(currentNodeObject);
	}
	else if(atNode){
		//Debug.Log("Current Node No. " + currentNode + " alertNode: " + alertNode);
		//Checks if the node is temporary before increasing currentNode
		if(!alertNode){
			// Makes sure that the guard will go from node 0 -> 1 -> 2 -> 3 -> 2 -> 1 -> 0 etc.
			if(currentNode == (nodeSize-1) && changeNode == 1){
				changeNode = -1;
			}
			if(currentNode == 0 && changeNode == -1){
				changeNode = 1;
			}
			else{
				currentNode += changeNode;
			}
			atNode = false;
		}
		else{
			alertNode = false;
			atNode = false;
		}
	}
	if(enemyVisionScript.viewDirection.x > 0){
		transform.localScale.x = Mathf.Abs(transform.localScale.x) * -1;
	} else{
		transform.localScale.x = Mathf.Abs(transform.localScale.x) * 1;
	}
	
	PlayerDetect();
}

function FixedUpdate(){
	speed = (transform.position - lastPosition).magnitude;
	lastPosition = transform.position;
}

//For hearing
function OnTriggerStay2D(other : Collider2D) {
	if (other.gameObject.layer == LayerMask.NameToLayer("SoundColliders")) {
			var tempCollider : Collider2D = other;
			if(!PlayerScript.showHiddenRooms)
				SeePlayer(tempCollider);
	}
}

function SeePlayer(other : Collider2D) {
	if(!PlayerScript.finishedLevel){
		//Instantiate new temp node and move to it
		if(enemyVisionScript.canSeePlayer){
			if(detectLevel >= 5.0){
				if(hasGun){
					ShootPlayer();
				}
				//If there is already a temporary node, delete it
				if(alert){
					Destroy(currentNodeObject);
				}
				//Set the guard to alert
				alert = true;
				//Instantiate at player's position
				currentNodeObject = Instantiate(newNode, player.transform.position, Quaternion.identity);	
				//moveToNode(currentNodeObject);
			}
		}
		else { //Heard a noise
			//Check that the node isn't behind a wall.
			var distToNode : float = Vector2.Distance(gameObject.transform.position, other.transform.position);
			var hit : RaycastHit2D = Physics2D.Raycast(transform.position, (other.transform.position - transform.position).normalized, distToNode, hearingMask);
			if (hit.collider != null) {
				return; //There is an object in the way.
			}
			
			//If there is already a temporary node, delete it
			if (alert) {
			Debug.Log("Heard a noise while alert, destroying old node");
				Destroy(currentNodeObject);
			}
			//Set the guard to alert
			alert = true;
			alertNode = true;
			atNode = false;
			isWaiting = false;
			var noiseLocation = other.gameObject.transform.position - transform.position;		
			GetComponent(EnemyVision).changeDirection(noiseLocation);
			//Instantiate at sound's position
			currentNodeObject = Instantiate(newNode, other.gameObject.transform.position, Quaternion.identity);
			moveToNode(currentNodeObject);
		}
		//These guards won't move, so we have to manually reset their look direction after the right amount of time.
		if (alertMoveSpeed == 0) {
			isWaiting = true;
			finishWaitTime = Time.time + waitTime - 0.1 ;		
			yield WaitForSeconds(waitTime);
			if (Time.time < finishWaitTime) {
				return;
			}
			if (currentNodeObject != null && currentNodeObject != nodes[0]) {
				Destroy(currentNodeObject);
			}
			alert = false;
			currentNodeObject = nodes[0];
			var nodeLocation = currentNodeObject.transform.GetChild(0).transform.position - transform.position;		
			GetComponent(EnemyVision).changeDirection(nodeLocation);
		}
	}
}

function moveToNode(node : GameObject) {
	if(debug){
		//Debug.Log("Moving to node: " + node.name);
		//Debug.Log(enemyVisionScript.canSeePlayer);
	}
	
	if (isWaiting && detectLevel < 5 || alertMoveSpeed == 0) {
		return;
	}
	//Check that the node isn't out of the guards reach
	var moveDirection : Vector2;
	if (gameObject.transform.position.x < node.transform.position.x) {
		moveDirection = Vector2.right;
	} else {
		moveDirection = -Vector2.right; 
	}
	var hit = Physics2D.Raycast(transform.position, moveDirection, stopDistance, hearingMask);
	Debug.DrawLine(gameObject.transform.position, (transform.position + moveDirection * stopDistance), Color.red);
	if (hit.collider != null && !onLadder) {
		/*isWaiting = true;
		//yield WaitForSeconds(waitTime);
		atNode = true;
		if (currentNodeObject != node) {
			return;
		}*/
		//Debug.Log("Guard " + gameObject.name + " Skipped Node");
		if (alert) {
			//Debug.Log("Destroying a node : " + node);
			alert = false;
			//Debug.Log("alert, currentNode: " + currentNode);
			currentNodeObject = nodes[currentNode];
			Destroy(node);
			isWaiting = false;
		} else {
			//Debug.Log("Not alert, currentNode: " + currentNode + " now + 1");
			currentNode = (currentNode + 1) % nodeSize;
			currentNodeObject = nodes[currentNode];
			isWaiting = false;
		}
		return;
	}
		
	moveSpeed = alert? alertMoveSpeed : patrolMoveSpeed;
	
	if(!isWaiting || enemyVisionScript.canSeePlayer){
		//Debug.Log("Moving to node " + node.name);
		if((node.transform.position.x + moveBuffer) > transform.position.x &&
		   (node.transform.position.x - moveBuffer) < transform.position.x){
			atNode = true;
			nodeScript = node.GetComponent(NodeScript);
			
			//Gets the LookPoint child object of the node and looks at it when the player reaches the node
			
			
			if(alert){
				GuardStuff(true);
				Destroy(node);
				alert = false;
				alertNode = true;
			}
			else {
				GuardStuff(false);
			}
		}
		else if(node.transform.position.x > transform.position.x) {
			ground = true;
			transform.Translate(Vector2.right * Time.deltaTime * moveSpeed);
			//guardController.move(Vector2.right * Time.deltaTime * moveSpeed);
			if(!alert){
				if(node.transform.GetChild(0) != null)
				GetComponent(EnemyVision).changeDirection(node.transform.GetChild(0).transform.position - transform.position);
			}
		}
		else if(node.transform.position.x < transform.position.x) {
			ground = true;
			transform.Translate(-Vector2.right * Time.deltaTime * moveSpeed);
			//guardController.move(-Vector2.right * Time.deltaTime * moveSpeed);
			if(!alert){
				if(node.transform.GetChild(0) != null)
				GetComponent(EnemyVision).changeDirection(node.transform.GetChild(0).transform.position - transform.position);
			}
		}
	}
}

function GuardStuff(isAlert : boolean){
	//This is where we should put stuff for the guards to do when they reach a node
	//An example is stop and wait, or have a smoke etc.
	
	//If the guard has reached a node in an alert state
	if(isAlert && !enemyVisionScript.canSeePlayer){
		isWaiting = true;
		finishWaitTime = Time.time + waitTime - 0.1 ;
		//Makes the guard wait after investigating a alert node
		yield WaitForSeconds(waitTime);
		if (Time.time < finishWaitTime) { //The guard heard a different noise.
			Debug.Log("returning without changing isWaiting");
			return;
		}
		isWaiting = false;
	}
	
	//Run function specific to current node
	nodeScript.Run(gameObject);
}

function PlayerDetect(){
	//Debug.Log(detectLevel);
	if(enemyVisionScript.canSeePlayer){
		if(detectLevel < 5.5){
			detectLevel += detectSpeed;
		}
		PlayerScript.updateDetectionLevel(detectLevel);
	} else{
		if(detectLevel > 0.0) {
			detectLevel -= cooldownSpeed;
		}
	}
}

function HurtPlayer(){
	//Put stuff here for when the player is hurt by a guard
	//an example could be losing life or being pushed back
	if(!isHurt && !PlayerScript.finishedLevel){
		isHurt = true;
		PlayerScript.beingHit = true;
		
		var num = Random.Range(0,4);
		AudioSource.PlayClipAtPoint(gruntSounds[num], player.transform.position, 0.4);
		//AudioSource.PlayClipAtPoint(dieSound, player.transform.position, 0.4);
		//yield WaitForSeconds(2);
		//Debug.Log("Playing grunt: " + (num + 1));
		
		if(player.transform.position.x - transform.position.x < 0)
			cController.move(new Vector3(-1,0.5,0) * 15 * Time.deltaTime);
		else
			cController.move(new Vector3(1,0.5,0) * 15 * Time.deltaTime);
		yield WaitForSeconds(0.5);
		AudioSource.PlayClipAtPoint(dieSound, player.transform.position, 0.4);
		yield WaitForSeconds(0.9);
		isHurt = false;
		PlayerScript.firstTry = false;
		PlayerScript.deathCount ++;
		PlayerScript.beingHit = false;
		Application.LoadLevel(Application.loadedLevel);
	}
}

function ShootPlayer(){
	if(shootSound != null && !isHurt && !shooting){
		AudioSource.PlayClipAtPoint(shootSound, transform.position, 0.4);
		shooting = true;
		yield WaitForSeconds(0.5);;
		shooting = false;
	}
	
	HurtPlayer();
}
