import './loaders/bibi';
import './loaders/enemy';

import '../models/textures/Warrior_marmoset_Base_Color.png';
import { Ground } from './environment/common/Ground';
import { Light } from './environment/common/Light';
import { world } from './environment/worlds/World';

import { Raycaster } from 'three';
import { Wall } from './environment/common/Wall';

import * as CANNON from 'cannon-es';

export const raycaster = new Raycaster();

window.onload = () => {
  const ground = new Ground();
  const light = new Light();
  const wall = new Wall();

  const sphereShape = new CANNON.Sphere(0.4);
  const sphereBody = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(2, 2, 2),
    shape: sphereShape,
  });
  world.physicsWorld.addBody(sphereBody);

  world.addBody(ground);
  world.addBody(wall);
  // world.addBody(wall);

  world.colorWorld.add(light);

  world.start();
};
