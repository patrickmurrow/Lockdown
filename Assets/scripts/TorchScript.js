#pragma strict

private var parent : GameObject;
private var position : Vector3;
private var flip : boolean = false;

function Start () {
	parent = transform.parent.gameObject;
	position = parent.transform.position;
}

function Update () {
	if(transform.parent.GetComponent(GuardScript).onLadder){
		transform.GetChild(0).active = false;
	} else{
		transform.GetChild(0).active = true;
	}	
	
	if(parent.transform.localScale.x < 0){
		flip = true;
		transform.localScale = new Vector3(-.75, 1, 1);
		transform.rotation = Quaternion.Euler(0,-207,180);
		//transform.position.x = position.x + 0.21;
	} else if(parent.transform.localScale.x > 0){
		flip = false;
		transform.localScale = new Vector3(.75, 1, 1);
		transform.rotation = Quaternion.Euler(0,0,180);
		//transform.position.x = position.x - 0.21;
	}
	
}