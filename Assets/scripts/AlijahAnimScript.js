#pragma strict

private var anim : Animator;
private var speed : float;
private var lastPosition : Vector3 = Vector3.zero;
private var doorCheck : boolean = true;

function Start () {
   anim = GetComponent(Animator);
}

function Update () {

}

function FixedUpdate () {
	speed = (transform.position - lastPosition).magnitude;
	lastPosition = transform.position;
	anim.SetFloat("Speed", speed);
	if (Time.time > 3){
		doorCheck = false;
	}
	anim.SetBool("Door", doorCheck);

}