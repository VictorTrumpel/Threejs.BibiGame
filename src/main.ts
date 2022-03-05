import './loaders/bibi';

import '../models/textures/Warrior_marmoset_Base_Color.png';
import { Ground } from './environment/common/Ground';
import { Light } from './environment/common/Light';
import { world } from './environment/worlds/World';

import { Raycaster } from 'three';
import { Wall } from './environment/common/Wall';

export const raycaster = new Raycaster();

window.onload = () => {
  const ground = new Ground();
  const light = new Light();
  const wall = new Wall();

  world.addBody(ground);
  // world.addBody(wall);
  // world.addBody(wall);

  world.colorWorld.add(light);

  world.start();
};
