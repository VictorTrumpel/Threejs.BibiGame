import { Vec3, Box, Body } from 'cannon-es';

const shape = new Box(new Vec3(0.4, 0.4, 0.4));

const BibiPhysics = new Body({
  mass: 100,
  type: Body.STATIC,
  position: new Vec3(0, 0, 0),
  shape,
  // isTrigger: true,
});

export default BibiPhysics;
