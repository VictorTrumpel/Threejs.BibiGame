import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import './models/textures/Warrior_marmoset_Base_Color.png';
import { Ground } from './app/Ground';
import { Soldier } from './app/Soldier';
import { World } from './app/World';
import { Raycaster, Object3D, Vector2, Vector3, AnimationClip } from 'three';

import { Vec3 } from 'cannon-es';
import { ThreeLine } from './app/Line';
import * as THREE from 'three';

import bibi from './models/bibi_gamer_anim.fbx';
import './models/vfx_bubble_01.png';
import textur from './models/bibi_gamer_tex.png';

window.onload = () => {
  let soldier: Soldier;

  const fbxLoader = new FBXLoader();
  const objLoader = new OBJLoader();
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

  fbxLoader.load(bibi, (gltf) => {
    console.log(gltf);
    gltf.scale.x = 0.002;
    gltf.scale.y = 0.002;
    gltf.scale.z = 0.002;
    world.colorWorld.add(gltf);
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
        const time = getTime(point, soldier.physique.position);

        console.log(soldier.skin);

        soldier.skin.lookAt(point);
        // soldier.rotate(point);
        //
        // soldier.run();
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
};
