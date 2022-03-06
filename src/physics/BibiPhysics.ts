import { Vec3, Box, Body } from 'cannon-es';

const shape = new Box(new Vec3(0.4, 0.1, 0.4));

const BibiPhysics = new Body({
  type: Body.KINEMATIC,
  position: new Vec3(0, 0, 0),
  fixedRotation: true,
  shape,
  // isTrigger: true,
});

export default BibiPhysics;
