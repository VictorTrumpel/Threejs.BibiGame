import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TextureLoader } from 'three';
import './models/textures/Warrior_marmoset_Base_Color.png';
import { Ground } from './app/Ground';
import { Soldier } from './app/Soldier';
import { World } from './app/World';
import { Raycaster, Object3D, Vector2, Vector3 } from 'three';

import { Vec3 } from 'cannon-es';
import { ThreeLine } from './app/Line';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import bibi from './models/bibi_gamer_anim.fbx';
import bibiTexture from './models/bibi_gamer_tex.png';
import { getLight } from './app/Light';

window.onload = () => {
  let soldier: Soldier;

  const textureLoader = new TextureLoader();
  const fbxLoader = new FBXLoader();
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

  fbxLoader.load(bibi, (fbx) => {
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('keydown', useUlt, false);

    console.log(fbx);

    fbx.scale.set(0.0015, 0.0015, 0.0015);

    const map = textureLoader.load(bibiTexture);

    fbx.children.map((child) => {
      // @ts-ignore
      if (child?.material?.isMeshPhongMaterial) {
        // @ts-ignore
        child.material.map = map;
      }
    });

    soldier = new Soldier(fbx, {
      idleAction: fbx.animations[4],
      runAction: fbx.animations[2],
      ultAction: fbx.animations[0],
    });

    world.addBody(soldier);
  });

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
        console.log('position: ', soldier.physique.position);

        const time = getTime(point, soldier.physique.position);

        soldier.skin.lookAt(point);
        //
        soldier.run();
        new TWEEN.Tween(soldier.physique.position)
          .to(
            {
              x: point.x,
              z: point.z,
            },
            time
          )
          .start()
          .onComplete(() => soldier.stop());
      }
    }
  }

  function useUlt(e: any) {
    if (e.code === 'Space') {
      soldier.ult();
    }
  }

  function getTime(point: Vector3, position: Vec3): number {
    const pointL = new Vector2(point.x, point.z);
    const posL = new Vector2(position.x, position.z);

    const distance = pointL.distanceTo(posL);

    return Math.abs(distance / 200) * 100000;
  }
};
