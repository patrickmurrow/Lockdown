using UnityEngine;
using System.Collections;


public class DemoScene : MonoBehaviour
{
	// movement config
	public float gravity = -25f;
	public float runSpeed = 4.5f;
	public float sneakSpeed = 1.5f;
	public float walkSpeed = 2.5f;
	public float groundDamping = 20f; // how fast do we change direction? higher means faster
	public float inAirDamping = 5f;
	public float jumpHeight = 3f;
	public float ladderSpeed = 3f;
	public Transform groundCheck;
	public LayerMask whatIsGround;

	public bool movementEnabled = true;

	[HideInInspector]
	private float normalizedHorizontalSpeed = 0;
	private CharacterController2D _controller;
	//private Animator _animator;
	private RaycastHit2D _lastControllerColliderHit;
	private Collider2D ladderCollider;
	private Vector3 _velocity;
	private Vector3 tempVector;
	private float playerInput = 0f;
	private float verticalInput = 0f;
	private float groundRadius = 0.05f;
	private float playerSpeed;
	public bool touchLadder = false;
	public bool onLadder = false;
	private bool grounded;
	private bool jumpTimer = true;
	

	void Awake()
	{
		//_animator = GetComponent<Animator>();
		_controller = GetComponent<CharacterController2D>();

		// listen to some events for illustration purposes
		_controller.onControllerCollidedEvent += onControllerCollider;
		_controller.onTriggerEnterEvent += onTriggerEnterEvent;
		_controller.onTriggerExitEvent += onTriggerExitEvent;

		playerSpeed = walkSpeed;
	}


	#region Event Listeners

	void onControllerCollider( RaycastHit2D hit )
	{
		// bail out on plain old ground hits cause they arent very interesting
		if( hit.normal.y == 1f )
			return;

		// logs any collider hits if uncommented. it gets noisy so it is commented out for the demo
		//Debug.Log( "flags: " + _controller.collisionState + ", hit.normal: " + hit.normal );
	}


	void onTriggerEnterEvent( Collider2D col )
	{
		//Debug.Log( "onTriggerEnterEvent: " + col.gameObject.name );
	}


	void onTriggerExitEvent( Collider2D col )
	{
		//Debug.Log( "onTriggerExitEvent: " + col.gameObject.name );
	}

	#endregion

	// the Update loop contains a very simple example of moving the character around and controlling the animation
	void Update(){
		if(Input.GetButton ("Sprint")){
			playerSpeed = runSpeed;
		}
		if(Input.GetButtonUp ("Sprint")){
			playerSpeed = walkSpeed;
		}
		if(Input.GetButton ("Sneak")){
			playerSpeed = sneakSpeed;
		}
		if(Input.GetButtonUp ("Sneak")){
			playerSpeed = walkSpeed;
		}
		if (!movementEnabled) {
			return;
		}
		// grab our current _velocity to use as a base for all calculations
		_velocity = _controller.velocity;
		playerInput = Input.GetAxis ("Horizontal");
		verticalInput = Input.GetAxis ("Vertical");

		// Check if the groundcheck object is colliding with the ground
		grounded = Physics2D.OverlapCircle(groundCheck.position, groundRadius, whatIsGround);

		if( _controller.isGrounded )
			_velocity.y = 0;

		if(playerInput != 0f){
			normalizedHorizontalSpeed = Mathf.Sign (playerInput);
		}
		else{
			normalizedHorizontalSpeed = 0;
		}


		// Lets the player get off the ladder if they move and jump at the same time
		if((onLadder && playerInput != 0f && verticalInput == 0f) || !touchLadder){
			onLadder = false;
		}

		// Puts the player on the ladder if they move up while touching the ladder
		if(touchLadder && Input.GetButton ("Vertical") && jumpTimer){
			onLadder = true;
			jumpTimer = false;
			// Start the timer before the player can grab the ladder again
			StartCoroutine(JumpTimer());
		}

		if (onLadder && touchLadder) {
			tempVector = transform.position;
			tempVector.x = ladderCollider.transform.position.x;
			transform.position = tempVector;

			if (verticalInput > 0f) {
				transform.Translate (Vector2.up * Mathf.Sign (verticalInput) * Time.deltaTime * ladderSpeed);
			}
			// !grounded makes sure you can't transform throught the ground
			if (verticalInput < 0f && !grounded) {
				transform.Translate (Vector2.up * Mathf.Sign (verticalInput) * Time.deltaTime * ladderSpeed);
			}
		}

		// we can only jump whilst grounded
		if((_controller.isGrounded || onLadder) && Input.GetButtonDown("Jump"))
		{
			_velocity.y = Mathf.Sqrt( 2f * jumpHeight * -gravity );
		}



		// apply horizontal speed smoothing it
		var smoothedMovementFactor = _controller.isGrounded ? groundDamping : inAirDamping; // how fast do we change direction?
		_velocity.x = Mathf.Lerp( _velocity.x, normalizedHorizontalSpeed * playerSpeed, Time.deltaTime * smoothedMovementFactor );

		// apply gravity before moving
		_velocity.y += gravity * Time.deltaTime;
		// Makes sure you can't fall on a ladder, and you can't move left and right until you get off
		if (onLadder) {
			if(_velocity.y < 0)
				_velocity.y = 0;

			_velocity.x = 0;
		}

		_velocity *= Time.deltaTime;
		_controller.move( _velocity );
	}

	void OnTriggerEnter2D(Collider2D other){
		if(other.gameObject.CompareTag("Ladder")){
			touchLadder = true;
			ladderCollider = other;
		}
	}

	void OnTriggerExit2D(Collider2D other){
		if(other.gameObject.CompareTag("Ladder")){
			touchLadder = false;
		}
	}
	
	IEnumerator JumpTimer(){
		yield return new WaitForSeconds(1);
		jumpTimer = true;
	}

}
