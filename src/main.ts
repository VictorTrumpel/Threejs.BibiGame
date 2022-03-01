import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import './models/textures/Warrior_marmoset_Base_Color.png';
import { Ground } from './app/Ground';
import { Soldier, SoldierActions } from './app/Soldier';
import { World } from './app/World';
import { Raycaster, Object3D, Vector2, Vector3, AnimationClip, Group, Scene } from 'three';

import { Vec3 } from 'cannon-es';
import { ThreeLine } from './app/Line';
import * as THREE from 'three';

import bibi from './models/bibi_gamer_anim.fbx';
import bibiWalk from './models/bibi_gamer_walk.dae';
import bibiIdle from './models/bibi_gamer_idle.dae';
import rogue from './models/rogue_legacy_knight.glb';
import soldierModel from './models/Soldier.glb';
import { getLight } from './app/Light';

window.onload = () => {
  let soldier: Soldier;

  const animations: AnimationClip[] = [];

  const fbxLoader = new FBXLoader();
  const loader = new GLTFLoader();
  const world = new World();
  const ground = new Ground();

  new ThreeLine(world);

  const raycaster = new Raycaster();

  const geometry = new THREE.CylinderGeometry(1, 0, 1, 12);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const conus = new THREE.Mesh(geometry, material);
  geometry.rotateX(Math.PI / 2);
  conus.position.z = -1;
  conus.position.x = -4;

  world.colorWorld.add(conus);

  world.addBody(ground);

  world.colorWorld.add(getLight());

  // loadAnimations();

  fbxLoader.load(bibi, (fbx) => {
    console.log(fbx);

    fbx.scale.set(0.0015, 0.0015, 0.0015);

    world.colorWorld.add(fbx);
  });

  // loader.load(rogue, (gltf) => {
  //   window.addEventListener('mousedown', onMouseDown, false);
  //
  //   const { scene: model } = gltf;
  //
  //   model.scale.set(0.002, 0.002, 0.002);
  //
  //   console.log(animations);
  //
  //   soldier = new Soldier(model, {
  //     idleAction: animations[0],
  //     runAction: animations[1],
  //   });
  //
  //   world.colorWorld.add(model);
  // });

  world.start();

  function onMouseDown(e: any) {
    const mouse2D = new Vector2(0, 0);

    mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse2D, world.colorWorld.camera);
    const intersects = raycaster.intersectObjects(world.colorWorld.scene.children, false);

    if (intersects.length > 0) {
      const intersect = intersects[0];

      const element: Object3D = intersect.object;
      const point = intersect.point;

      if (element.userData.name !== 'CUBE') {
        const time = getTime(point, soldier.physique.position);

        soldier.skin.lookAt(point);
        //
        soldier.run();
        // new TWEEN.Tween(soldier.physique.position)
        //   .to(
        //     {
        //       x: point.x,
        //       z: point.z,
        //     },
        //     time
        //   )
        //   .start()
        //   .onComplete(() => soldier.stop());
      }
    }
  }

  function getTime(point: Vector3, position: Vec3): number {
    const pointL = new Vector2(point.x, point.z);
    const posL = new Vector2(position.x, position.z);

    const distance = pointL.distanceTo(posL);

    return Math.abs(distance / 200) * 100000;
  }

  function loadAnimations() {
    let elf: Scene;

    const loadingManager = new THREE.LoadingManager(function () {
      world.colorWorld.add(elf);
    });

    const colladaLoader = new ColladaLoader(loadingManager);

    colladaLoader.load(bibiIdle, (collada) => {
      elf = collada.scene;
      console.log(elf);
      elf.scale.set(0.0002, 0.0002, 0.0002);
    });

    colladaLoader.load(bibiWalk, (collada) => {
      collada.scene.scale.set(0.002, 0.002, 0.002);
      // @ts-ignore
      animations[1] = collada?.animations[0];
    });
  }
};
