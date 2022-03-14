import { Vec3, Box, Body } from 'cannon-es';

const EnemyPhysics = (position: Vec3, scale?: Vec3) =>
  new Body({
    type: Body.KINEMATIC,
    position: position,
    shape: new Box(scale || new Vec3(0.5, 0.5, 0.5)),
  });

export default EnemyPhysics;
