import * as THREE from 'three';
import { World } from './World';
import { Vec3 } from 'cannon-es';
import * as CANNON from 'cannon-es';

export class ThreeLine {
  constructor(world: World) {
    const lineGeometry = new THREE.BoxGeometry(10, 0.05, 0.05);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.x = 5;
    line.position.y = 0;
    line.position.z = 0;

    const vec3 = new Vec3(0.1, 0.2, 0.4);
    const body = new CANNON.Body({
      mass: 92,
      position: new CANNON.Vec3(3, 2, -1),
      shape: new CANNON.Box(vec3),
    });

    world.colorWorld.add(line);
    world.physicsWorld.addBody(body);
  }
}
