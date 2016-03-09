#pragma strict

var sounds : AudioClip[];
var ladderSounds : AudioClip[];

var sneakSpeed : float = 0.04;
var runSpeed : float = 0.06;
var sneakDelay : float = 0.8;
var runDelay : float = 0.35;
var sneakVolume : float = 0.5;
var runVolume : float = 1.0;
var ladderDelay : float = 0.8;
var ladderVolume : float = 0.2;
var isGuard : boolean = false;

private var lastPosition : Vector3 = Vector3.zero;
private var isPlaying : boolean = false;
private var isPlayingLadder : boolean = false;
private var isJumping : boolean = false;

private var speed : float = 0f;

function Start () {

}

function Update () {
	if(speed > runSpeed){
		PlaySound(runDelay, runVolume);
	}
	else if(speed > sneakSpeed){
		PlaySound(sneakDelay, sneakVolume);
	}
	
	if(PlayerScript.onLadder && Mathf.Abs(Input.GetAxis("Vertical")) != 0 && !isGuard){
		PlayLadderSound();
	}
}
 
function FixedUpdate(){
	speed = (transform.position - lastPosition).magnitude;
	lastPosition = transform.position;
}

function PlaySound(delay : float, volume : float){
	if(isGuard){
		if(!isPlaying){
			audio.Stop();
			audio.volume = volume * 0.75;
			var num = Random.Range(0,3);
			audio.clip = sounds[num];
			isPlaying = true;
			audio.Play();
			
			yield WaitForSeconds(delay);
			isPlaying = false;
		}
	}else if(!isPlaying && PlayerAnimScript.grounded && !PlayerScript.onLadder){
		audio.Stop();
		audio.volume = volume;
		num = Random.Range(0,3);
		audio.clip = sounds[num];
		isPlaying = true;
		audio.Play();
		
		yield WaitForSeconds(delay);
		isPlaying = false;
	}
}

function PlayLadderSound(){
	if(!isPlayingLadder){
		
		audio.Stop();
		audio.volume = ladderVolume;
		var num = Random.Range(0,4);
		Debug.Log(num);
		audio.clip = ladderSounds[num];
		isPlayingLadder = true;
		audio.Play();
		
		yield WaitForSeconds(ladderDelay);
		isPlayingLadder = false;
	}
}

function PlayJump(){
	if(PlayerAnimScript.grounded && !isJumping){
			isJumping = true;
			AudioSource.PlayClipAtPoint(sounds[3], transform.position);
		
			yield WaitForSeconds(0.3);
			isJumping = false;
	}
}