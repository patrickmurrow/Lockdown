#pragma strict

private var anim : Animator;
private var lastPosition : Vector3 = Vector3.zero;
var speed : float = 0f;


function Start () {
   // Initialise the reference to the Animator component
   anim = GetComponent(Animator);
}

function Update () {
}

function FixedUpdate(){
	speed = (transform.position - lastPosition).magnitude;
	lastPosition = transform.position;
	anim.SetFloat("Speed", speed);
}