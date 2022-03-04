import { TextureLoader, AnimationAction, AnimationMixer, Vector3 } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { MovementBody } from './MovementBody';

import bibiModel from '../models/bibi_gamer_anim.fbx';
import bibiTexture from '../models/bibi_gamer_tex.png';
import { Body } from 'objects/Body';
import { setAnimationWeight } from '../helpers/setAnimationWeight';

export enum BibiActionCode {
  // eslint-disable-next-line no-unused-vars
  Run = 2,
  // eslint-disable-next-line no-unused-vars
  Idle = 4,
}

class BibiCharacter extends MovementBody {
  private mixer: AnimationMixer;
  readonly scale: number = 0.0015;
  private animations: AnimationAction[] = [];

  constructor(physique: Body) {
    super(physique);

    this.mixer = new AnimationMixer(this.skin);
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

  public run() {
    const run = this.animations[BibiActionCode.Run];
    const idle = this.animations[BibiActionCode.Idle];

    setAnimationWeight(idle, 0);
    setAnimationWeight(run, 1);

    idle.crossFadeTo(run, 0.5, true);
  }

  public stop() {
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

  public moveToPoint(point: Vector3) {
    this.run();
    super.moveToPoint(point, () => this.stop());
  }

  public update(timer: number) {
    super.update(timer);
    this.mixer.update(timer);
  }
}

export default BibiCharacter;
