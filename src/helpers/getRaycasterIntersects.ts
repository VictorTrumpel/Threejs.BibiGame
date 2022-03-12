import { Vector2 } from 'three';
import { raycaster } from '../main';
import world from '../environment/worlds/World';
import { Intersection } from 'three/src/core/Raycaster';

export const getRaycasterIntersects = (mouse2D: Vector2): Intersection[] => {
  raycaster.setFromCamera(mouse2D, world.colorWorld.camera);
  return raycaster.intersectObjects(world.colorWorld.scene.children, false);
};
