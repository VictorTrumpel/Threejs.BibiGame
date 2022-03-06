import { Vec3, Box, Body } from 'cannon-es';

const shape = new Box(new Vec3(0.5, 0.5, 0.5));

const EnemyPhysics = new Body({
  type: Body.KINEMATIC,
  position: new Vec3(-2, 0.5, -2),
  shape,

  // isTrigger: true,
});

export default EnemyPhysics;
