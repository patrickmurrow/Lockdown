// Transforms to act as start and end markers for the journey.
	var startMarker: Transform = null;
	var endMarker: Transform = null;
	var ladder : boolean = false;
	
	// Movement speed in units/sec.
	var speed = 2.0;
	
	// Time when the movement started.
	private var startTime: float;
	
	// Total distance between the markers.
	private var journeyLength: float;
	
	var target : Transform = null;
	var smooth = 5.0;
	
	function Start() {
		// Keep a note of the time the movement started.
		startTime = Time.time;
		//Debug.Log(target.name + " got on a ladder");
		target.GetComponent(GuardScript).onLadder = true;
		ladder = true;
		// Calculate the journey length.
		journeyLength = Vector3.Distance(startMarker.position, endMarker.position);
	}
	
	// Follows the target position like with a spring
	function Update () {
		if(target.position.y == endMarker.position.y){
			//Debug.Log(target.name + " got off a ladder");
			target.GetComponent(GuardScript).onLadder = false;
			ladder = false;
			Destroy(this);
		}
		// Distance moved = time * speed.
		var distCovered = (Time.time - startTime) * speed;
		
		// Fraction of journey completed = current distance divided by total distance.
		var fracJourney = distCovered / journeyLength;
		
		// Set our position as a fraction of the distance between the markers.
		target.transform.position = Vector3.Lerp(startMarker.position, endMarker.position, fracJourney);
	}