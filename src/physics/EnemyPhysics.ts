import { Vec3, Box, Body } from 'cannon-es';

const shape = new Box(new Vec3(0.5, 0.5, 0.5));

const EnemyPhysics = (position: Vec3) =>
  new Body({
    type: Body.KINEMATIC,
    position: position,
    shape,

    // isTrigger: true,
  });

export default EnemyPhysics;
