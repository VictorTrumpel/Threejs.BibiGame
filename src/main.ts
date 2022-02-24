import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import soldierModel from './models/Soldier.glb';
import { Ground } from './app/Ground';
import { Soldier } from './app/Soldier';
import { World } from './app/World';
import { Raycaster, Object3D, Vector2, Vector3 } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Vec3 } from 'cannon-es';
import { ThreeLine } from './app/Line';
import * as THREE from 'three';

window.onload = () => {
  let soldier: Soldier;

  const loader = new GLTFLoader();
  const world = new World();
  const ground = new Ground();

  new ThreeLine(world);

  const raycaster = new Raycaster();

  world.addBody(ground);

  loader.load(soldierModel, (gltf) => {
    window.addEventListener('mousedown', onMouseDown, false);

    const { scene: model, animations } = gltf;

    soldier = new Soldier(model, {
      idleAction: animations[0],
      walkAction: animations[3],
      runAction: animations[1],
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
        const time = getTime(point, soldier.physique.position);

        const angle = createPointLine(soldier.skin.position, point);

        soldier.rotate(angle);

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

  function getAngle(point: Vector3, position: Vec3) {
    const { x: pointX, z: pointZ } = point;
    const { x: posX, z: posZ } = position;

    const positinV = new Vector3(position.x, 0, position.z);
    const pointV = new Vector2(point.x, point.z);

    const angle = pointV.angle();

    console.log('Math.atan2(y,x): ', Math.atan2(position.z, position.x));

    console.log('angle: ', angle);

    const composition = pointX * posX + pointZ * posZ;
    const lengthPoint = Math.sqrt(Math.pow(pointX, 2) + Math.pow(pointZ, 2));
    const lengthPos = Math.sqrt(Math.pow(posX, 2) + Math.pow(posZ, 2));

    const samAngle = composition / (lengthPoint + lengthPos);

    console.log('samAngle: ', samAngle);

    return Math.atan2(position.z, position.x);
  }

  function getTime(point: Vector3, position: Vec3): number {
    const pointL = new Vector2(point.x, point.z);
    const posL = new Vector2(position.x, position.z);

    const distance = pointL.distanceTo(posL);

    return Math.abs(distance / 200) * 100000;
  }

  function createPointLine(positionVector: Vector3, pointPosition: Vector3) {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const points = [];
    points.push(positionVector);
    points.push(pointPosition);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    world.colorWorld.add(line);

    console.log(line);

    const cubeGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Line(cubeGeometry, cubeMaterial);

    console.log(cube);

    world.colorWorld.add(cube);

    return line.quaternion;
  }
};
