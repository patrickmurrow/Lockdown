#pragma strict

var target : Transform;

function Update () {
	var newRotation : Quaternion = Quaternion.LookRotation(transform.position - target.position, -Vector3.forward);
    newRotation.x = 0.0;
    newRotation.y = 0.0;
    transform.rotation = newRotation;
}