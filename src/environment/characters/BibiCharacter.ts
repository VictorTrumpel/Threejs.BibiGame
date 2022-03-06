import { TextureLoader, AnimationAction, AnimationMixer, Vector3, Object3D } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { raycaster } from '../../main';

import { world } from '../worlds/World';

import { MovementBody } from '../bodyes/MovementBody';

import bibiModel from '../../../models/bibi_gamer_anim.fbx';
import bibiTexture from '../../../models/bibi_gamer_tex.png';
import { Body } from 'objects/Body';
import { setAnimationWeight } from '../../helpers/setAnimationWeight';
import { getMouse2DCords } from '../../helpers/getMouse2DCords';
import { BodyUserData } from '../bodyes/PhysicalBody';
import * as TWEEN from '@tweenjs/tween.js';
import { getPointsLength } from '../../helpers/getPointsLength';

export enum BibiActionCode {
  // eslint-disable-next-line no-unused-vars
  Run = 2,
  // eslint-disable-next-line no-unused-vars
  Idle = 4,
}

export type BibiUserData = BodyUserData & {
  isMoving?: boolean;
  range: number;
};

class BibiCharacter extends MovementBody {
  private mixer: AnimationMixer;
  readonly scale: number = 0.0015;
  private animations: AnimationAction[] = [];
  private userData: BibiUserData;

  constructor(physique: Body) {
    super(physique);
    this.mixer = new AnimationMixer(this.skin);
    this.userData = {
      objectType: 'BibiCharacter',
      range: 1.5,
    };
  }

  private activateAllAnimations() {
    this.animations.forEach((action, idx) => {
      action.enabled = true;
      action.play();

      switch (idx) {
        case BibiActionCode.Run:
          action.setEffectiveWeight(0);
          return;
        case BibiActionCode.Idle:
          action.setEffectiveWeight(1);
          return;
        default:
          action.setEffectiveWeight(0);
      }
    });
  }

  private run() {
    if (this.userData.isMoving) return;

    const run = this.animations[BibiActionCode.Run];
    const idle = this.animations[BibiActionCode.Idle];

    setAnimationWeight(idle, 0);
    setAnimationWeight(run, 1);

    idle.crossFadeTo(run, 0.5, true);
  }

  private stop() {
    const run = this.animations[BibiActionCode.Run];
    const idle = this.animations[BibiActionCode.Idle];

    setAnimationWeight(idle, 1);

    run.crossFadeTo(idle, 0.3, true);
  }

  public async loadModel() {
    const { scale } = this;

    const bibiFBX = await new FBXLoader().loadAsync(bibiModel);
    const texture = await new TextureLoader().loadAsync(bibiTexture);
    this.mixer = new AnimationMixer(bibiFBX);

    bibiFBX.scale.set(scale, scale, scale);

    this.skin = bibiFBX;
    this.animations = bibiFBX.animations.map((animation) => this.mixer.clipAction(animation));
    this.activateAllAnimations();

    bibiFBX.children.map((child) => {
      // @ts-ignore
      if (child?.material?.isMeshPhongMaterial) {
        // @ts-ignore
        child.material.map = texture;
      }
    });
  }

  public mouseEvent(e: MouseEvent) {
    const mouse2D = getMouse2DCords(e);

    raycaster.setFromCamera(mouse2D, world.colorWorld.camera);
    const [intersect] = raycaster.intersectObjects(world.colorWorld.scene.children, false);
    const { object, point } = intersect || {};

    if (e.button === 0) this.moveEvent(object, point);
    if (e.button === 2) this.fightEvent(object);
  }

  private fightEvent(object: Object3D) {
    if (!object?.userData?.isEnemy) return;

    const { position } = object;
    const { skin, userData } = this;

    if (getPointsLength(position, skin.position) <= userData.range) return;

    super.moveToPoint(
      new Vector3(position.x, 0, position.z),
      () => {
        this.run();
        this.userData.isMoving = true;
      },
      () => {
        this.stop();
        this.userData.isMoving = false;
      },
      (tween) => {
        if (!(getPointsLength(position, skin.position) <= userData.range)) return;
        tween.stop();
        this.stop();
        this.userData.isMoving = false;
      }
    );
  }

  private moveEvent(object: Object3D, point: Vector3) {
    if (object?.userData?.isGround) {
      this.moveToPoint(point);
    }
  }

  public moveToPoint(point: Vector3) {
    super.moveToPoint(
      point,
      () => {
        this.run();
        this.userData.isMoving = true;
      },
      () => {
        this.stop();
        this.userData.isMoving = false;
      }
    );
  }

  public update(timer: number) {
    super.update(timer);
    this.mixer.update(timer);
  }
}

export default BibiCharacter;
