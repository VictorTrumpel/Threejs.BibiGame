import './loaders/bibi';

import '../models/textures/Warrior_marmoset_Base_Color.png';
import { Ground } from './environment/common/Ground';
import { world } from './environment/worlds/World';

import { getLight } from './environment/common/Light';
import { Raycaster } from 'three';

export const raycaster = new Raycaster();

window.onload = () => {
  const ground = new Ground();

  world.addBody(ground);

  world.colorWorld.add(getLight());

  world.start();
};
