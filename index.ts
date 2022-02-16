import { THREE } from './src/THREE';
import { Cube } from './src/Cube';
import { Scene } from './src/Scene';
import * as CANNON from 'cannon';
import { Color } from 'three';

window.onload = () => {
  const cube = new Cube();
  const scene = new Scene();

  scene.scene.background = new Color('white');

  scene.add(cube);

  // world
  const world = new CANNON.World();
  world.gravity.set(0, -9.8, 0);

  //plane
  const groundBody = new CANNON.Body({ mass: 0 });
  const groundShape = new CANNON.Plane();
  groundBody.addShape(groundShape);
  world.addBody(groundBody);

  //@ts-ignore
  const cannonDebug = new THREE.CannonDebugRenderer(scene.scene, world);

  const loop = (time: number) => {
    time *= 0.001;

    world.step(1 / 60);

    cube.rotation.y = time;
    cube.rotation.x = time;

    cannonDebug.update();

    scene.render();
    requestAnimationFrame(loop);
  };

  loop(0);
};
