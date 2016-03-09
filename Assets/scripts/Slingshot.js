#pragma strict

var shotPrefab : Transform;
var tracerDotSprite : Transform;

var startingAmmo : int;
var force : float;
var cooldown: float;

var tracerMask : LayerMask;

var tracerStep: float = 0.06;

private var aimDirection : Vector2;
private var lastShot: float;

function Start () {
	PlayerScript.ammo = startingAmmo;
}

function Update () {
	var mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	aimDirection = -(transform.position - mousePosition);
	if (Input.GetMouseButtonDown(0)) {
		//pullBackStart = Time.time;
	} else if (Input.GetMouseButtonUp(0) && !PlayerScript.isHidden) {
		shoot();
	}
	if (PlayerScript.slingshotEquipped) {
		showTracer();
	}
}

function shoot() {
	if (PlayerScript.ammo <= 0 || Time.time - lastShot < cooldown || !PlayerScript.slingshotEquipped) {
		return;
	}
	var shot = Instantiate(shotPrefab);
	shot.gameObject.tag = "PlayerShot";
	shot.position = transform.position;
	shot.GetComponent(Rigidbody2D).AddForce(aimDirection.normalized * force);
	lastShot = Time.time;
	PlayerScript.ammo--;
}

function showTracer() {
	//The .02 here is the length of FixedUpdate
	var StartVelocity : Vector3 = (aimDirection.normalized * force * 0.02) / shotPrefab.GetComponent(Rigidbody2D).mass;
    var PredictionTime : float = 1;

    var momentum : Vector3 = StartVelocity;
    var pos : Vector3  = gameObject.transform.position;
    var last : Vector3 = gameObject.transform.position;
    var dotsArray = new Array();
    for (var i = 0; i < (40); i++) {
    	momentum = (momentum + Physics.gravity * tracerStep);
        pos = pos + momentum * tracerStep;
        var dot = Instantiate(tracerDotSprite);
        dotsArray.push(dot);
        dot.position = pos;
        dot.gameObject.layer = LayerMask.NameToLayer("Ignore Raycast");
        //Check if next position hits a wall.
    	var direction : Vector2 = pos - last;
        var distance : float = Vector3.Distance(last, pos);
        var hit: RaycastHit2D = Physics2D.Raycast(last, direction, distance, tracerMask);
        Debug.DrawLine(last, last + direction * distance, Color.red);
        if (hit.collider != null && !hit.collider.isTrigger) {
        	var o : Transform = dotsArray.pop()as Transform;
        	Destroy(o.gameObject);
        	if (dotsArray.length > 0) {
        		o = dotsArray.pop()as Transform;
        		Destroy(o.gameObject);
        	}
            break;
        }
        last = pos;
    }
    yield;
	for (var j = 0; j < dotsArray.length; j++) {
		var g : Transform = dotsArray[j] as Transform;
		Destroy(g.gameObject);
	}
}