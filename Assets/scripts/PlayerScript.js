#pragma strict

static var player : GameObject;
static var isLight : boolean = false;
static var isRunning : boolean = false;
static var isSprinting : boolean = false;
static var isSneaking : boolean = false;
static var isWalking : boolean = false;
static var isHidden : boolean = false;
static var detected : boolean = false;
static var onLadder : boolean = false;
static var touchLadder : boolean = false;
static var enableRenderer : boolean = true;
static var slingshotEquipped : boolean = false;
static var hasKeyCard : boolean = false;
static var hasSlingShot : boolean = false;
static var hasTalked : boolean = false;
static var showPauseScreen : boolean = false;
static var isTalking : boolean = false;
static var beingHit = false;

static var canMove : boolean = true;
static var loaderLevel : float = 0f;
static var loaderSpeed : float = 0.2;
static var detectionLevel : float = 0;
static var ammo : int = 0;
static var showHiddenRooms : boolean = false;
static var deathCount : int = 0;
static var currentTime : float;
static var startTime : float;
static var firstTry : boolean = true;
static var finishedLevel : boolean = false;
//Seconds it takes for player to hide.
static var hideTime : float = 0;
//The time the player takes to stop sneaking.
var sneakStickTime : float = 0f;
static var openingDoor : boolean = false;
var enterCrateSound : AudioClip;
var exitCrateSound : AudioClip;
var paperSound : AudioClip;
var giveSlingshot : boolean = false;
var giveKeyCard : boolean = false;
//Whether or not the player is in the process of hiding.
static var hiding : boolean = false;

private var letGoOfSneak : boolean = false;
private var letSneakGoTime : float;
private var demoScene : DemoScene;
private var delay : boolean = false;
public static var collidingObject : GameObject;

public static var collidingWithHideable : boolean = false;

static var paperNumber : int = 0;
static var touchingPaper : boolean = false;
static var readingPaper : boolean = false;

//So I can stop the player moving from cut scene scripts
static var inCutScene : boolean = false;

function Start() {
	demoScene = GetComponent(DemoScene);
	
	//Reset variables on death
	collidingWithHideable = false;
	enableRenderer = true;
	player = gameObject;
	isSneaking = false;
	letGoOfSneak = false;
	hasKeyCard = false;
	canMove = true;
	isHidden = false;
	isLight = false;
	detectionLevel = 0;
	touchingPaper = false;
	readingPaper = false;
	
	if(firstTry){
		ResetTimer();
		deathCount = 0;
		finishedLevel = false;
	}
	if(giveSlingshot){
		hasSlingShot = true;
	}
	if(giveKeyCard){
		hasKeyCard = true;
	}
}

function Update () {
	touchLadder = GetComponent(DemoScene).touchLadder;
	currentTime = Time.time - startTime;
	
	//Debug.Log(showPauseScreen);
	if(Input.GetButtonDown("Cancel") && showPauseScreen && !delay){
		Debug.Log("Close");
		showPauseScreen = false;
		Screen.showCursor = false;
		TimeDelay(0);
	}
	
	if(Input.GetButtonDown("Cancel") && !showPauseScreen && Application.loadedLevel != 0 && !delay  && !readingPaper && !isTalking){
		Debug.Log("Open");
		showPauseScreen = true;
		TimeDelay(0);
	}
	
	// Checks if the player is walking/running
	if(Input.GetAxis("Horizontal") != 0f) { 
		isRunning = true;        
	} else{
		isRunning = false;
	}
	
	if(!canMove){
		demoScene.movementEnabled = false;
	} else{
		demoScene.movementEnabled = true;
	}
	
	if(readingPaper && !delay){
		//We do this instead of Input.anyKey to detect when a key is released instead of initally pressed
		if(Input.GetButtonUp("Open") || Input.GetButtonUp("Cancel") || Input.GetButtonUp("Jump") || Input.GetButtonUp("Fire1")){
			readingPaper = false;
			canMove = true;
			TimeDelay(0.1);
		}
	}
	
	if (touchingPaper && Input.GetButtonUp("Open") && !delay) {
		if(!readingPaper){
			readingPaper = true;
			audio.clip = paperSound;
			audio.volume = 1;
			audio.Play();
			canMove = false;
			TimeDelay(0.1);
		} 
	}
	
	if(Input.GetButton ("Sprint")){
		isSprinting = true;
	}
	else{
		isSprinting = false;
	}
	if(Input.GetButtonDown ("Sneak")){
		isSneaking = true;
	}
	if(Input.GetButtonUp ("Sneak")){
		isSneaking = false;
	}
	
	if(Input.GetButtonDown("SlingShot") && hasSlingShot && !isHidden && !onLadder) {
		if (slingshotEquipped) {
			slingshotEquipped = false;
		} else {
			slingshotEquipped = true;
		}
	}
	
	if(isHidden || onLadder || openingDoor){
		slingshotEquipped = false;
	}
	//Debug.Log(isHidden);
	if (Input.GetButton("Open") && collidingWithHideable) {
		canMove = false;
		if(loaderLevel < 8.0 && !isHidden){
			loaderLevel += loaderSpeed;
		}
		if (!isHidden && loaderLevel >= 8.0) {
			hidePlayer();
		}
	} else{
		loaderLevel = 0.0;
		if(!isHidden && !openingDoor && !readingPaper && !inCutScene){
			canMove = true;
		}
	}
	
	if(Input.GetButtonDown("Open")){
		if(isHidden){
			unHidePlayer();
		}
	}
	
	//if a guard sees the player, this value will change again this update.
	if (detectionLevel > 0) {
		detectionLevel -= GuardScript.cooldownSpeed;
	}
	onLadder = GetComponent(DemoScene).onLadder;

	if (onLadder) {
		isSneaking = false;
	}
	
	if(enableRenderer){
		renderer.enabled = true;
		for(var child : Transform in transform){
			if(child.renderer != null){
				child.renderer.enabled = true;
			}
		}
	} else{
		renderer.enabled = false;
		for(var child : Transform in transform){
			if(child.renderer != null){
				child.renderer.enabled = false;
			}
		}
	}
	
}

function hidePlayer() {
	//Debug.Log("hiding player");
	canMove = false;
	hiding = true;
	collidingObject.audio.clip = enterCrateSound;
	
	collidingObject.audio.Play();
	yield WaitForSeconds (hideTime);
	if (!hiding || !collidingWithHideable) {
		return;	//Player cancelled hiding.
	}
	isHidden = true;
	loaderLevel = 0.0;
	hiding = false;
	enableRenderer = false;
	gameObject.GetComponent(BoxCollider2D).enabled = false;	
	gameObject.FindWithTag("StealthCollider").GetComponent(CircleCollider2D).enabled = false;
}


function unHidePlayer() {
	enableRenderer = true;
	gameObject.GetComponent(BoxCollider2D).enabled = true;
	gameObject.FindWithTag("StealthCollider").GetComponent(CircleCollider2D).enabled = true;
	isHidden = false;
	hiding = false;
	canMove = true;
	collidingObject.audio.clip = exitCrateSound;
	collidingObject.audio.Play();
	//Give the player a little bit of sneak time, so they don't
	//move and instantly alert a guard with noise.
	/*if (!isSneaking) {
		isSneaking = true;
		letSneakGoTime = Time.time;
		letGoOfSneak = true;
	}*/
}

function OnTriggerStay2D(other : Collider2D) {
	if(other.gameObject.CompareTag("Light")){
		isLight = true;
	}
	
	if (other.gameObject.layer == LayerMask.NameToLayer("HideableObject")) {
		collidingWithHideable = true;
		collidingObject = other.gameObject;
	}
	
	if(other.gameObject.CompareTag("Enemy")){
		detected = true;
	}
}
function OnTriggerExit2D(other : Collider2D){
	if(other.gameObject.CompareTag("Light")){
		isLight = false;
	}
	
	if(other.gameObject.CompareTag("Enemy")){
		detected = false;
	}
	
	if (other.gameObject.layer == LayerMask.NameToLayer("HideableObject")) {
		collidingWithHideable = false;
		//Debug.Log("not colliding with hideable");
	}
}

function TimeDelay(num : float){
	delay = true;
	if(num != 0){
		yield WaitForSeconds(num);
	} else{
		yield;
	}
	
	delay = false;
}

static function updateDetectionLevel(newDetectLevel : float) {
	if (newDetectLevel > detectionLevel) {
		detectionLevel = newDetectLevel;
	}
}

static function ResetTimer(){
	startTime = Time.time;
}

static function CurrentTime(){
	return currentTime;
}