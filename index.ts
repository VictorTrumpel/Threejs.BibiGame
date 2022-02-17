import * as THREE from 'three';
import { CannonDebugRenderer, DebugProto } from './developTools/CannonDebugRenderer';
import { OrbitControls } from '@three-ts/orbit-controls';
import { Cube } from './src/Cube';
import { Scene } from './src/Scene';
import * as CANNON from 'cannon';
import { Color } from 'three';
import { Vec3 } from 'cannon';

window.onload = () => {
  // @ts-ignore
  THREE.CannonDebugRenderer = CannonDebugRenderer;
  // @ts-ignore
  THREE.CannonDebugRenderer.prototype = DebugProto;

  window.addEventListener('mousedown', onMouseDown, false);

  const cube = new Cube();
  const scene = new Scene();

  cube.userData.name = 'CUBE';

  console.log(cube);

  scene.add(cube);

  scene.scene.background = new Color('white');

  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 'brown', side: THREE.DoubleSide });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

  scene.add(plane);

  // world
  const world = new CANNON.World();
  world.gravity.set(0, -9.8, 0);

  //plane
  const groundBody = new CANNON.Body({ mass: 0 });
  const groundShape = new CANNON.Plane();
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(groundBody);

  const controls = new OrbitControls(scene.camera, scene.renderer.domElement);
  controls.update();
  controls.enableDamping = true;

  const cubeBody = new CANNON.Body({
    mass: 9,
    position: new CANNON.Vec3(0, 5, 0),
  });
  const cubeVec = new Vec3(0.5, 0.5, 0.5);
  const cubShape = new CANNON.Box(cubeVec);
  cubeBody.addShape(cubShape);
  world.addBody(cubeBody);

  console.log(cubeBody);

  //@ts-ignore
  const cannonDebug = new THREE.CannonDebugRenderer(scene.scene, world);

  loop(0);

  function loop(time: number) {
    time *= 0.001;

    world.step(1 / 60);
    world.step(1 / 60);

    cube.position.z = cubeBody.position.z;
    cube.position.x = cubeBody.position.x;
    cube.position.y = cubeBody.position.y;

    cube.quaternion.z = cubeBody.quaternion.z;
    cube.quaternion.x = cubeBody.quaternion.x;
    cube.quaternion.y = cubeBody.quaternion.y;
    cube.quaternion.w = cubeBody.quaternion.w;

    cannonDebug.update();
    controls.update();

    scene.render();
    requestAnimationFrame(loop);
  }

  function onMouseDown(e: any) {
    console.log(e);
  }
};
