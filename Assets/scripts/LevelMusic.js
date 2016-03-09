#pragma strict

var mainAudio : AudioClip;
var endLevelAudio : AudioClip;
var hiddenRoomAudio : AudioClip;
var dieSound : AudioClip;
var play : boolean = true;
var playS : boolean = true;
static var playH : boolean = false;
var playEnd : boolean = true;
var volume : double;

function Start () {
}

function Update () {
if(play && !playH){
 			audio.clip = dieSound;
			audio.Play();
			audio.clip = mainAudio;
			audio.volume = volume;
			audio.Play();
			play = false;
		}
		else if (EndLevelScript.onScreen && playEnd){
				audio.clip = mainAudio;
				audio.Pause();
				audio.clip = endLevelAudio;			
				audio.Play();
				playEnd = false;
			}
	if (playH && playS){
		audio.clip = mainAudio;
		audio.Pause();
		audio.clip = hiddenRoomAudio;
		audio.Play();
		playS = false;
		play = true;
	}

		
}