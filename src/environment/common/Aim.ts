import { Mesh, CylinderGeometry, MeshBasicMaterial } from 'three';
import world from '../worlds/World';

export class Aim extends Mesh {
  constructor() {
    const geometry = new CylinderGeometry(0.8, 1, 0.1, 32, 5, true);
    const material = new MeshBasicMaterial({ color: 'red' });

    super(geometry, material);

    this.visible = false;
    this.position.y = 0;
  }
}

export const aim = new Aim();

world.colorWorld.add(aim);
