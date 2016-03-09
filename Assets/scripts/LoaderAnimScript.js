#pragma strict

var loaderImages : Sprite[];

private var loaderUI : UI.Image;

function Start () {
	loaderUI = GetComponent(UI.Image);
}

function Update () {
	if(PlayerScript.loaderLevel > 0){
		loaderUI.enabled = true;
	} else{
		loaderUI.enabled = false;
	}

	if(PlayerScript.loaderLevel > 7){
		loaderUI.sprite = loaderImages[7];
	} else if(PlayerScript.loaderLevel > 6){
		loaderUI.sprite = loaderImages[6];
	} else if(PlayerScript.loaderLevel > 5){
		loaderUI.sprite = loaderImages[5];
	} else if(PlayerScript.loaderLevel > 4){
		loaderUI.sprite = loaderImages[4];
	} else if(PlayerScript.loaderLevel > 3){
		loaderUI.sprite = loaderImages[3];
	} else if(PlayerScript.loaderLevel > 2){
		loaderUI.sprite = loaderImages[2];
	} else if(PlayerScript.loaderLevel > 1){
		loaderUI.sprite = loaderImages[1];
	} else if(PlayerScript.loaderLevel > 0){
		loaderUI.sprite = loaderImages[0];
	}
}