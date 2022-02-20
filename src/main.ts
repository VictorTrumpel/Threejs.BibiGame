import * as THREE from 'three';
import { Object3D, Group } from 'three';

import { ColorWorld } from './app/ColorWorld';
import * as CANNON from 'cannon-es';
import CannonDebugRenderer from './utils/cannonDebugRenderer';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import soldier from './models/Soldier.glb';
import { OrbitControls } from '@three-ts/orbit-controls';
import * as TWEEN from '@tweenjs/tween.js';
import { Ground } from './app/Ground';

window.onload = () => {
  let model: Group;

  // let mixer: THREE.AnimationMixer;
  // let idleAction: THREE.AnimationAction, walkAction: THREE.AnimationAction, runAction: THREE.AnimationAction;
  // let actions: THREE.AnimationAction[];

  window.addEventListener('mousedown', onMouseDown, false);

  const clock = new THREE.Clock();

  const scene = new ColorWorld();
  const raycaster = new THREE.Raycaster();

  const ground = new Ground();

  scene.add(ground);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(-1, 4, -10);
  scene.add(dirLight);

  const world = new CANNON.World();
  world.gravity.set(0, -9.8, 0);

  const groundBody = new CANNON.Body({ mass: 0 });
  const groundShape = new CANNON.Plane();
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(groundBody);

  const cylinderBody = new CANNON.Body({
    mass: 9,
    position: new CANNON.Vec3(0, 5, 0),
  });
  const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1.6, 6);
  cylinderBody.addShape(cylinderShape);
  world.addBody(cylinderBody);

  const controls = new OrbitControls(scene.camera, scene.renderer.domElement);
  controls.enableDamping = true;

  const cannonDebug = new CannonDebugRenderer(scene.scene, world);

  const loader = new GLTFLoader();
  loader.load(soldier, (gltf) => {
    model = gltf.scene;

    scene.add(model);

    console.log('quar3: ', model.quaternion);

    // const skeleton = new THREE.SkeletonHelper(model);
    // skeleton.visible = false;
    // scene.add(skeleton);
    //
    // const animations = gltf.animations;
    //
    // console.log(animations);
    //
    // mixer = new THREE.AnimationMixer(model);
    //
    // idleAction = mixer.clipAction(animations[0]);
    // walkAction = mixer.clipAction(animations[3]);
    // runAction = mixer.clipAction(animations[1]);
    //
    // actions = [idleAction, walkAction, runAction];
    //
    // activateAllActions();
  });

  console.log('Q3: ', cylinderBody.quaternion);

  // function activateAllActions() {
  //   setWeight(idleAction, 0);
  //   setWeight(walkAction, 0);
  //   setWeight(runAction, 1);
  //
  //   actions?.forEach(function (action: THREE.AnimationAction) {
  //     action.play();
  //   });
  // }

  // function setWeight(action: THREE.AnimationAction, weight: number) {
  //   action.enabled = true;
  //   action.setEffectiveTimeScale(1);
  //   action.setEffectiveWeight(weight);
  // }

  loop();

  function loop() {
    console.log();

    let mixerUpdateDelta = clock.getDelta();

    world.step(mixerUpdateDelta);

    // if (mixer) {
    //   mixer.update(mixerUpdateDelta);
    // }

    if (model) {
      model.position.z = cylinderBody.position.z;
      model.position.x = cylinderBody.position.x;
      model.position.y = cylinderBody.position.y - 0.8;

      model.quaternion.z = cylinderBody.quaternion.z;
      model.quaternion.x = cylinderBody.quaternion.x;
      model.quaternion.y = cylinderBody.quaternion.y;
      model.quaternion.w = cylinderBody.quaternion.w;
    }

    cannonDebug.update();
    controls.update();
    TWEEN.update();

    scene.render();
    requestAnimationFrame(loop);
  }

  function onMouseDown(e: any) {
    const mouse2D = new THREE.Vector2(0, 0);

    mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse2D, scene.camera);
    const intersects = raycaster.intersectObjects(scene.scene.children, false);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const element: Object3D = intersect.object;
      const point = intersect.point;

      if (element.userData.name !== 'CUBE') {
        new TWEEN.Tween(cylinderBody.position)
          .to(
            {
              x: point.x,
              z: point.z,
            },
            500
          )
          .start();
      }
    }
  }
};
