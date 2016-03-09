#pragma strict

var mainAudio : AudioClip;
var endLevelAudio : AudioClip;
var hiddenRoomAudio : AudioClip;
var play : boolean = true;
var playEnd : boolean = true;
var volume : double;

function Start () {

}

function Update () {
		if(play){
			//audio.clip = dieSound;
			audio.clip = mainAudio;
			//audio.volume = volume;
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

		
}
