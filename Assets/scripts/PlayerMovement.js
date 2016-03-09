#pragma strict

// Reference to animator component
private var anim : Animator;

// Speed of the movement
var speed: float = 6.0;
var originalSpeed : float = speed;
var jumpSpeed : float = 8.0;

// Direction of the movement
private   var movementDir: int;

// Keep track of time when frog is moving
// and when it is in air
private var moving: boolean = false;

private var grounded : boolean = false;
private var groundRadius : float = 0.2f;
var groundCheck : Transform;
var whatIsGround : LayerMask;
var jumpForce : float = 700f;
var doubleJump : boolean = false;

// When object loads...
function Start () {
   // Initialise the reference to the Animator component
   anim = GetComponent(Animator);
}

// At fixed time intervals...
function FixedUpdate () {
	// Checks if groundCheck collides with any object in the whatIsGround layer
	grounded = Physics2D.OverlapCircle(groundCheck.position, groundRadius, whatIsGround);
	if(grounded){
		doubleJump = false;
	}

	anim.SetBool("Ground", grounded);
	// Pass the player's vertical speed to the animator
	anim.SetFloat("vSpeed", rigidbody2D.velocity.y);	
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
        
        // movementDir will be +ve if mouse is to the right of the player,
        // and -ve if it is to the left
        var mouseX : float = Input.mousePosition.x - Screen.width/2;
        movementDir = Mathf.Sign(mouseX);
        transform.localScale.x = Mathf.Abs(transform.localScale.x)*movementDir;       
    }
    
    if(moving) {
      // Move the game object
      var userInput: int = Mathf.Sign(Input.GetAxis("Horizontal"));
      var shift: Vector3 = Vector3.right;
      shift = Vector3.right * userInput * speed * Time.deltaTime;
      //transform.Translate(shift);
      //transform.Translate(shift);
      rigidbody2D.AddForce(shift * 300);
   }
   
   // Move the camera along with the player
   Camera.main.transform.position.x = transform.position.x;
   Camera.main.transform.position.y = (2 + transform.position.y);
   
   if(Input.GetButtonDown("Jump") && (grounded || !doubleJump)){
   	anim.SetBool("Ground", false);
   	rigidbody2D.AddForce(new Vector2(0, jumpForce));
   	
   	if(!doubleJump && !grounded){
   		doubleJump = true;
   	}
   }
   
   if(Input.GetButtonDown("Sprint")){
   	speed = 8.0;
   }
   
   if(Input.GetButtonUp("Sprint")){
   	speed = originalSpeed;
   }
}  