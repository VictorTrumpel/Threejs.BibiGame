import './loaders/bibi';

import './models/textures/Warrior_marmoset_Base_Color.png';
import { Ground } from './app/Ground';
import { World } from './app/World';

import { getLight } from './app/Light';

export const world = new World();

window.onload = () => {
  const ground = new Ground();

  world.addBody(ground);

  world.colorWorld.add(getLight());

  world.start();
};
