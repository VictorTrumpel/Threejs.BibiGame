import * as THREE from 'three';

const geometry = new THREE.CylinderGeometry(1, 0, 1, 12);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

export const PreloadSkin = new THREE.Mesh(geometry, material);
