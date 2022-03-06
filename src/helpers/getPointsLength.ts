import { Vector3 } from 'three';

export const getPointsLength = (point1: Vector3, point2: Vector3): number => {
  return new Vector3(point1.x - point2.x, 0, point1.z - point2.z).length();
};
