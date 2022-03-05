import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PhysicalBody } from '../bodyes/PhysicalBody';
import { Body } from 'cannon-es';

export class Wall extends PhysicalBody {
  constructor() {
    const planeGeometry = new THREE.PlaneGeometry(5, 5);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 'green', side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI);

    const groundBody = new CANNON.Body({
      mass: 5,
      type: Body.KINEMATIC,
      position: new CANNON.Vec3(0, 0, -3),
    });
    const groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI);

    super(groundBody, plane);
  }
}
