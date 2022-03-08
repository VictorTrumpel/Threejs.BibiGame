import '../interface/styles.css';

import './loaders/bibi';
import './loaders/enemy';

import '../models/textures/Warrior_marmoset_Base_Color.png';
import { Ground } from './environment/common/Ground';
import { Light } from './environment/common/Light';
import { world } from './environment/worlds/World';

import { Raycaster } from 'three';

export const raycaster = new Raycaster();

window.onload = () => {
  const ground = new Ground();
  const light = new Light();

  world.addBody(ground);
  world.colorWorld.add(light);

  world.start();
};
