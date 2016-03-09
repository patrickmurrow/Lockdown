#pragma strict

//Where along the path of the spotlight the spotlight begins.
var startPosition : float = 0;
//The distance from the 'source' (guard tower) of the light to the middle point of the lights path
var middleOffset : float;
var panSpeed : float;
var panDistance : float;

//The extra amount to move the collider per degree of light rotation.
var colliderRotOffset : float = 0.06;
//The angle the light will be rotated when it is maxAngleDistance away from the 'source'
var maxAngle : float = 45;
//The distance the light must be from the 'source' to reach the maximum rotaion angle.
var maxAngleDistance : float;

private var middleX : float;
private var sourcePosition : Vector2;

function Start () {
	//Debug.Log(transform.eulerAngles);
	sourcePosition = transform.position;
	middleX = transform.position.x + middleOffset;
}

function Update () {
	//Move the light and collider along x axis.
	transform.position.x = middleX + (Mathf.Sin((Time.timeSinceLevelLoad + startPosition) * panSpeed) * panDistance);
	var collider = GetComponentInChildren(CircleCollider2D).gameObject;
	collider.transform.position.x = middleX + (Mathf.Sin((Time.timeSinceLevelLoad + startPosition) * panSpeed) * panDistance);
	
	//Now rotate the light.
	var distanceFromSource = Vector2.Distance(sourcePosition, transform.position);
	var yRotation = (distanceFromSource / maxAngleDistance) * maxAngle * Mathf.Sign(transform.position.x - sourcePosition.x);
	transform.eulerAngles = Vector3(61, yRotation, 0);
	
	//Now move the collider some amount if the light is on an angle.
	collider.transform.position.x += yRotation * colliderRotOffset;
}