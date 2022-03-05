import { DirectionalLight } from 'three';

export class Light extends DirectionalLight {
  constructor() {
    super();

    this.position.set(-3, 10, -10);
    this.castShadow = true;
    this.shadow.camera.top = 2;
    this.shadow.camera.bottom = -2;
    this.shadow.camera.left = -2;
    this.shadow.camera.right = 2;
    this.shadow.camera.near = 0.1;
    this.shadow.camera.far = 40;
  }
}
