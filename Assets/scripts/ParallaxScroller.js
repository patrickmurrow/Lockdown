#pragma strict

var scrollSpeed : float = 0.5;

private var player : GameObject;
private var startingPos : Vector2;
private var currentPos : Vector2;
private var currentOffset : float;
private var spritePos : Vector2;

function Start(){
	player = GameObject.Find("Player");
	spritePos = transform.position;
	startingPos = player.transform.position;
}

function Update(){
	currentPos = player.transform.position;
	currentOffset = startingPos.x - currentPos.x;
        
    transform.position.x = spritePos.x + (currentOffset * scrollSpeed);

}