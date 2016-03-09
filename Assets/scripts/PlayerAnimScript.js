#pragma strict

// Reference to animator component
private var anim : Animator;
// Direction of the movement
var movementDir: int = 1;
// Keep track of time when frog is moving
// and when it is in air
private var moving: boolean = false;
private var groundRadius : float = 0.2f;
private var stealthCollider : CircleCollider2D;
private var arm : Transform = null;

static var grounded : boolean = false;
static var isRight : boolean;
static var slingshotEquip : boolean = false;


var groundCheck : Transform;
var whatIsGround : LayerMask;

// When object loads...
function Start () {
   // Initialise the reference to the Animator component
   anim = GetComponent(Animator);
   arm = transform.FindChild ("arm");
}

// At fixed time intervals...
function FixedUpdate () {
	// Checks if groundCheck collides with any object in the whatIsGround layer
	grounded = Physics2D.OverlapCircle(groundCheck.position, groundRadius, whatIsGround);
	
	if (PlayerScript.slingshotEquipped){
		slingshotEquip = true;
		}
	else{
		slingshotEquip = false;
		}
	anim.SetBool("Hide", Input.GetButton("Open") && PlayerScript.collidingWithHideable || PlayerScript.isHidden);
	anim.SetBool("Open", PlayerScript.openingDoor);
	anim.SetBool("Climb", PlayerScript.touchLadder);
	anim.SetBool("Slingshot", slingshotEquip);
	anim.SetBool("Ground", grounded);
	// Pass the player's vertical speed to the animator
	anim.SetFloat("vSpeed", Mathf.Abs(Input.GetAxis("Vertical")));	
	// Tell the animator if the character is moving  
	anim.SetFloat("Speed", Mathf.Abs(Input.GetAxis("Horizontal")));
	    
	var userInput: float = Input.GetAxis("Horizontal");
	
	if(userInput != 0f) { 
		moving = true;        
	} else{
		moving = false;
	}


}
// Per every frame...
function Update() {
   // Generate a plane that intersects the transform's position with an right-facing normal.
    var playerPlane = new Plane(Vector3.forward, transform.position);
 
    // Generate a ray from the cursor position
    var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
 
    // Determine the point where the cursor ray intersects the plane.
    // This will be the point that the object must look towards to be looking at the mouse.
    // Raycasting to a Plane object only gives us a distance, so we'll have to take the distance,
    //   then find the point along that ray that meets that distance.  This will be the point
    //   to look at.
    var hitdist = 2.0;

    
    // If the ray is parallel to the plane, Raycast will return false.
    if (playerPlane.Raycast (ray, hitdist)) {
        // Get the point along the ray that hits the calculated distance.
        var targetPoint = ray.GetPoint(hitdist);
        
        //movementDir will be +ve if mouse is to the right of the player,
        // and -ve if it is to the left
        var mouseX : float = Input.mousePosition.x - Screen.width/2;
        if(PlayerScript.slingshotEquipped)
        	movementDir = Mathf.Sign(mouseX);
        else if(Input.GetAxis("Horizontal") != 0){
        	movementDir = Mathf.Sign(Input.GetAxis("Horizontal"));
        }
        if (mouseX > 0) {
        	isRight = true;
      	}
        	else{
        	isRight = false;
        }
        transform.localScale.x = Mathf.Abs(transform.localScale.x)*movementDir;
        if(arm != null)
        	arm.transform.localScale.x = Mathf.Abs(arm.transform.localScale.x)*movementDir;  
  
    	}
    }
    

   
   // Move the camera along with the player
   //Camera.main.transform.position.x = transform.position.x;
   //Camera.main.transform.position.y = (2 + transform.position.y);
   
   if(Input.GetButtonDown("Jump") && (grounded)){
   	anim.SetBool("Ground", false);
   }
 