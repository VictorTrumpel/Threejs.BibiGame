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
  const mouse = {
    x: {
      current: 0,
      previous: 0,
      calc: 0,
    },
    y: {
      current: 0,
      previous: 0,
      calc: 0,
    },
  };

  const container = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  let soldier: Soldier;

  const loader = new GLTFLoader();
  const world = new World();
  const ground = new Ground();

  new ThreeLine(world);

  const raycaster = new Raycaster();

  world.addBody(ground);

  loader.load(soldierModel, (gltf) => {
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mousemove', mousemove, false);

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

        const headRY = calc(mouse.x.calc, -200, 200, -Math.PI / 4, Math.PI / 4);

        console.log('headRY: ', headRY);

        soldier.rotate(headRY);

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

  function getTime(point: Vector3, position: Vec3): number {
    const pointL = new Vector2(point.x, point.z);
    const posL = new Vector2(position.x, position.z);

    const distance = pointL.distanceTo(posL);

    return Math.abs(distance / 200) * 100000;
  }

  function mousemove(e: any) {
    mouse.x.current = e.clientX;
    mouse.y.current = e.clientY;
    mouse.x.calc = mouse.x.current - container.width / 2;
    mouse.y.calc = mouse.y.current - container.height / 2;
  }

  function calc(v: number, vmin: number, vmax: number, tmin: number, tmax: number) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + pc * dt;
    return tv;
  }
};
