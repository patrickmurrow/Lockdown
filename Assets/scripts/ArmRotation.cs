using UnityEngine;
using System.Collections;

public class ArmRotation : MonoBehaviour {

	// Update is called once per frame
	void Update () {
		Vector3 difference = Camera.main.ScreenToWorldPoint (Input.mousePosition) - transform.position;
		difference.Normalize ();   //Normalising the Vector i.e the sum of the vector will equal 1

		float rotZ = Mathf.Atan2(difference.y, difference.x) * Mathf.Rad2Deg; // find the angle in degrees

		transform.rotation = Quaternion.Euler(0f, 0f, rotZ - 90);
	}

}


