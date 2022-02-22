import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import soldierModel from './models/Soldier.glb';
import { Ground } from './app/Ground';
import { Soldier } from './app/Soldier';
import { World } from './app/World';
import { Raycaster, Object3D, Vector2, Vector3 } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Vec3 } from 'cannon-es';
import { ThreeLine } from './app/Line';

window.onload = () => {
  let soldier: Soldier;

  const loader = new GLTFLoader();
  const world = new World();
  const ground = new Ground();

  const helperLines = new ThreeLine(world);

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
        const angle = getAngle(point, soldier.physique.position);

        const time = getTime(point, soldier.physique.position);

        // soldier.rotate(getAngle(point, soldier.physique.position));
        soldier.rund();
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

    const composition = pointX * posX + pointZ * posZ;
    const lengthPoint = Math.sqrt(Math.pow(pointX, 2) + Math.pow(pointZ, 2));
    const lengthPos = Math.sqrt(Math.pow(posX, 2) + Math.pow(posZ, 2));

    return composition / (lengthPoint + lengthPos);
  }

  function getTime(point: Vector3, position: Vec3): number {
    console.log('point: ', point);
    console.log('position: ', position);

    const pointL = new Vector2(point.x, point.z).length();
    const posL = new Vector2(position.x, position.z).length();

    // console.log('pointL: ', pointL);
    // console.log('posL: ', posL);

    const length = new Vector2(point.x, point.z).length() - new Vector2(position.x, position.z).length();

    const time = Math.abs(length / 200) * 100000;

    // console.log('time: ', time);
    // console.log('length: ', length);
    //
    // console.log('-------------');

    return time;
  }

  // let model: Group;
  //
  // // let mixer: THREE.AnimationMixer;
  // // let idleAction: THREE.AnimationAction, walkAction: THREE.AnimationAction, runAction: THREE.AnimationAction;
  // // let actions: THREE.AnimationAction[];
  //

  //
  // const clock = new THREE.Clock();
  //
  // const scene = new ColorWorld();
  // const raycaster = new THREE.Raycaster();
  //
  // const ground = new Ground();
  //
  // scene.add(ground);
  //
  // const dirLight = new THREE.DirectionalLight(0xffffff);
  // dirLight.position.set(-1, 4, -10);
  // scene.add(dirLight);
  //
  // const world = new CANNON.World();
  // world.gravity.set(0, -9.8, 0);
  //
  // const groundBody = new CANNON.Body({ mass: 0 });
  // const groundShape = new CANNON.Plane();
  // groundBody.addShape(groundShape);
  // groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  // world.addBody(groundBody);
  //
  // const cylinderBody = new CANNON.Body({
  //   mass: 9,
  //   position: new CANNON.Vec3(0, 5, 0),
  // });
  // const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1.6, 6);
  // cylinderBody.addShape(cylinderShape);
  // world.addBody(cylinderBody);
  //
  // const controls = new OrbitControls(scene.camera, scene.renderer.domElement);
  // controls.enableDamping = true;
  //
  // const cannonDebug = new CannonDebugRenderer(scene.scene, world);
  //
  // const loader = new GLTFLoader();
  // loader.load(soldier, (gltf) => {
  //   model = gltf.scene;
  //
  //   const anim = gltf.animations[0];
  //
  //   scene.add(model);
  //
  //   console.log('quar3: ', model.quaternion);
  //
  //   //
  //   // const animations = gltf.animations;
  //   //
  //   //
  //   //
  //   // actions = [idleAction, walkAction, runAction];
  //   //
  //   // activateAllActions();
  // });
  //
  // console.log('Q3: ', cylinderBody.quaternion);
  //
  // // function activateAllActions() {
  // //   setWeight(idleAction, 0);
  // //   setWeight(walkAction, 0);
  // //   setWeight(runAction, 1);
  // //
  // //   actions?.forEach(function (action: THREE.AnimationAction) {
  // //     action.play();
  // //   });
  // // }
  //
  // // function setWeight(action: THREE.AnimationAction, weight: number) {
  // //   action.enabled = true;
  // //   action.setEffectiveTimeScale(1);
  // //   action.setEffectiveWeight(weight);
  // // }
  //
  // loop();
  //
  // function loop() {
  //   console.log();
  //
  //   let mixerUpdateDelta = clock.getDelta();
  //
  //   world.step(mixerUpdateDelta);
  //
  //   // if (mixer) {
  //   //   mixer.update(mixerUpdateDelta);
  //   // }
  //
  //   if (model) {
  //     model.position.z = cylinderBody.position.z;
  //     model.position.x = cylinderBody.position.x;
  //     model.position.y = cylinderBody.position.y - 0.8;
  //
  //     model.quaternion.z = cylinderBody.quaternion.z;
  //     model.quaternion.x = cylinderBody.quaternion.x;
  //     model.quaternion.y = cylinderBody.quaternion.y;
  //     model.quaternion.w = cylinderBody.quaternion.w;
  //   }
  //
  //   cannonDebug.update();
  //   controls.update();
  //   TWEEN.update();
  //
  //   scene.render();
  //   requestAnimationFrame(loop);
  // }
  //
};
