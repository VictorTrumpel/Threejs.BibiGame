import * as THREE from 'three';
import { Mesh } from 'three';

type CubeOptions = {
  size?: number;
  color?: string;
};

export class Cube extends Mesh {
  constructor(options?: CubeOptions) {
    const { size, color } = options || { size: 1, color: 'gray' };

    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color });

    super(geometry, material);
  }
}
