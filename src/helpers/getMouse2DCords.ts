import { Vector2 } from 'three';

export const getMouse2DCords = (e: MouseEvent): Vector2 => {
  const mouse2D = new Vector2(0, 0);

  mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;

  return mouse2D;
};
