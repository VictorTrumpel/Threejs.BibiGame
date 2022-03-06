import * as THREE from 'three';
import { PhysicalBody } from '../bodyes/PhysicalBody';
import * as CANNON from 'cannon-es';

export class Ground extends PhysicalBody {
  constructor() {
    const planeGeometry = new THREE.BoxGeometry(20, 20, 0.05);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

    const groundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(10, 10, 0.01)),
    });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    plane.userData.isGround = true;

    super(groundBody, plane);
  }
}
