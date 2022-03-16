import * as THREE from 'three';

THREE.Cache.enabled = true;

import '../interface';
import '../interface/index.scss';

// import './loaders/bibi';
import './loaders/enemy';
import './loaders/tigro';

import { Ground } from './environment/common/Ground';
import { Light } from './environment/common/Light';
import world from './environment/worlds/World';

import { Raycaster } from 'three';

export const raycaster = new Raycaster();

const ground = new Ground();
const light = new Light();

world.addBody(ground);
world.colorWorld.add(light);

window.onload = () => {
  world.start();
};

document.oncontextmenu = () => false;
