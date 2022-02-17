initCannon();
init();
animate();

function init() {
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('mousedown', onMouseDown, false);
  window.addEventListener('mouseup', onMouseUp, false);
}

function onMouseDown(e) {
  // Find mesh from a ray
  var entity = findNearestIntersectingObject(e.clientX, e.clientY, camera, meshes);
  var pos = entity.point;
  if (pos && entity.object.geometry instanceof THREE.BoxGeometry) {
    constraintDown = true;
    // Set marker on contact point
    setClickMarker(pos.x, pos.y, pos.z, scene);

    // Set the movement plane
    setScreenPerpCenter(pos, camera);

    var idx = meshes.indexOf(entity.object);
    if (idx !== -1) {
      addMouseConstraint(pos.x, pos.y, pos.z, bodies[idx]);
    }
  }
}

function findNearestIntersectingObject(clientX, clientY, camera, objects) {
  // Get the picking ray from the point
  var raycaster = getRayCasterFromScreenCoord(clientX, clientY, camera, projector);

  // Find the closest intersecting object
  // Now, cast the ray all render objects in the scene to see if they collide. Take the closest one.
  var hits = raycaster.intersectObjects(objects);
  var closest = false;
  if (hits.length > 0) {
    closest = hits[0];
  }

  return closest;
}

// Function that returns a raycaster to use to find intersecting objects
// in a scene given screen pos and a camera, and a projector
function getRayCasterFromScreenCoord(screenX, screenY, camera, projector) {
  var mouse3D = new THREE.Vector3();
  // Get 3D point form the client x y
  mouse3D.x = (screenX / window.innerWidth) * 2 - 1;
  mouse3D.y = -(screenY / window.innerHeight) * 2 + 1;
  mouse3D.z = 0.5;
  return projector.pickingRay(mouse3D, camera);
}

function setClickMarker(x, y, z) {
  if (!clickMarker) {
    var shape = new THREE.SphereGeometry(0.2, 8, 8);
    clickMarker = new THREE.Mesh(shape, markerMaterial);
    scene.add(clickMarker);
  }
  clickMarker.visible = true;
  clickMarker.position.set(x, y, z);
}

function removeClickMarker() {
  clickMarker.visible = false;
}

function onMouseMove(e) {
  // Move and project on the plane
  if (gplane && mouseConstraint) {
    var pos = projectOntoPlane(e.clientX, e.clientY, gplane, camera);
    if (pos) {
      setClickMarker(pos.x, pos.y, pos.z, scene);
      moveJointToPoint(pos.x, pos.y, pos.z);
    }
  }
}

// This function creates a virtual movement plane for the mouseJoint to move in
function setScreenPerpCenter(point, camera) {
  // If it does not exist, create a new one
  if (!gplane) {
    var planeGeo = new THREE.PlaneGeometry(100, 100);
    var plane = (gplane = new THREE.Mesh(planeGeo, material));
    plane.visible = false; // Hide it..
    scene.add(gplane);
  }

  // Center at mouse position
  gplane.position.copy(point);

  // Make it face toward the camera
  gplane.quaternion.copy(camera.quaternion);
}

function onMouseUp(e) {
  constraintDown = false;
  // remove the marker
  removeClickMarker();

  // Send the remove mouse joint to server
  removeJointConstraint();
}

var lastx, lasty, last;
function projectOntoPlane(screenX, screenY, thePlane, camera) {
  var x = screenX;
  var y = screenY;
  var now = new Date().getTime();
  // project mouse to that plane
  var hit = findNearestIntersectingObject(screenX, screenY, camera, [thePlane]);
  lastx = x;
  lasty = y;
  last = now;
  if (hit) return hit.point;
  return false;
}

function animate() {
  requestAnimationFrame(animate);
  //controls.update();
  updatePhysics();
  render();
}

function updatePhysics() {
  world.step(dt);
  for (var i = 0; i !== meshes.length; i++) {
    meshes[i].position.copy(bodies[i].position);
    meshes[i].quaternion.copy(bodies[i].quaternion);
  }
}

function render() {
  renderer.render(scene, camera);
}

function initCannon() {
  boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  boxBody = new CANNON.Body({ mass: mass });
  boxBody.addShape(boxShape);
  world.addBody(boxBody);
}

function addMouseConstraint(x, y, z, body) {
  // The cannon body constrained by the mouse joint
  constrainedBody = body;

  // Vector to the clicked point, relative to the body
  var v1 = new CANNON.Vec3(x, y, z).vsub(constrainedBody.position);

  // Apply anti-quaternion to vector to tranform it into the local body coordinate system
  var antiRot = constrainedBody.quaternion.inverse();
  pivot = antiRot.vmult(v1); // pivot is not in local body coordinates

  // Move the cannon click marker particle to the click position
  jointBody.position.set(x, y, z);

  // Create a new constraint
  // The pivot for the jointBody is zero
  mouseConstraint = new CANNON.PointToPointConstraint(constrainedBody, pivot, jointBody, new CANNON.Vec3(0, 0, 0));

  // Add the constriant to world
  world.addConstraint(mouseConstraint);
}

// This functions moves the transparent joint body to a new postion in space
function moveJointToPoint(x, y, z) {
  // Move the joint body to a new position
  jointBody.position.set(x, y, z);
  mouseConstraint.update();
}

function removeJointConstraint() {
  // Remove constriant from world
  world.removeConstraint(mouseConstraint);
  mouseConstraint = false;
}
