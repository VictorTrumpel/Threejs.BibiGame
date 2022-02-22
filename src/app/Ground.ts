import { Mesh } from 'three';
import * as THREE from 'three';
import { Body } from './Body';
import * as CANNON from 'cannon-es';

export class Ground extends Body {
  constructor() {
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

    const groundBody = new CANNON.Body({ mass: 0 });
    const groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    super(plane, groundBody);
  }
}
