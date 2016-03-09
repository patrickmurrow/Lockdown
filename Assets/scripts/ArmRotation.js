#pragma strict

var flipslingshot : int = -1;
var tempcheck : int = 1;
var temp : int = 2;
var start : boolean = true;

function Update(){
	if (start){ 
		StartFlip();
		start = false;
		}
	var difference : Vector3 = Camera.main.ScreenToWorldPoint (Input.mousePosition) - transform.position;
	difference.Normalize ();   //Normalising the Vector i.e the sum of the vector will equal 1
	
	var rotZ : float = Mathf.Atan2(difference.y, difference.x) * Mathf.Rad2Deg; // find the angle in degrees
	var flipped : boolean = true;
	var rotate : float = rotZ - 90;

	
	if (!PlayerScript.slingshotEquipped){
		transform.position.z = PlayerScript.player.transform.position.z + 1;
		//transform.position.z = 2;
		}
	else if (PlayerScript.slingshotEquipped){
		//transform.position.z = -1.11;
		transform.position.z = PlayerScript.player.transform.position.z - 0.00001;
		}
	if ((rotZ + 90) > 0 && (rotZ + 90) < 180) {
		flipped = false;
		}
		
	if (PlayerAnimScript.isRight && !flipped){
		rotate = rotZ + 0;
		flipslingshot = -1;	
	}


	if (!PlayerAnimScript.isRight && flipped){
		rotate = -rotZ + 0;
		flipslingshot = 1;

		}
	Flip();	
	transform.rotation = Quaternion.Euler(0f, 0f, rotate);
}

function Flip(){
	if (!(temp - flipslingshot == tempcheck)){
		var theScale : Vector3 = transform.localScale;
    	theScale.y *= -1;
    	transform.localScale = theScale;
    	tempcheck = temp - flipslingshot;
    	}
 }
 
 function StartFlip(){
 	var theScale : Vector3 = transform.localScale;
	theScale.y *= -1;
	transform.localScale = theScale;
}