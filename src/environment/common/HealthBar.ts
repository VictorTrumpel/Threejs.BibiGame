import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import * as THREE from 'three';

export class HealthBar extends Mesh {
  constructor() {
    const healthBarGeom = new PlaneGeometry(1, 0.2);
    const healthBarMaterial = new MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide });

    super(healthBarGeom, healthBarMaterial);

    this.scale.x = 1;
  }
}
