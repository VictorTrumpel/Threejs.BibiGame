import { MovementBody } from './MovementBody';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import bibiModel from '../../../models/bibi_gamer_anim.fbx';
import { AnimationAction, AnimationMixer, TextureLoader } from 'three';
import bibiTexture from '../../../models/bibi_gamer_tex.png';
import { Body } from 'objects/Body';
import { setAnimationWeight } from '../../helpers/setAnimationWeight';
import { BodyUserData } from './PhysicalBody';

export enum BibiActionCode {
  // eslint-disable-next-line no-unused-vars
  Run = 2,
  // eslint-disable-next-line no-unused-vars
  Idle = 4,
  Attack = 6,
}

export type BibiUserData = BodyUserData & {
  isMoving?: boolean;
  isFighting?: boolean;
  range: number;
};

export class BibiBody extends MovementBody {
  private mixer: AnimationMixer;
  readonly scale = 0.0015;

  public animations: AnimationAction[] = [];

  constructor(physique: Body) {
    super(physique);
    this.mixer = new AnimationMixer(this.skin);
  }

  public actions() {
    const run = this.animations[BibiActionCode.Run];
    const idle = this.animations[BibiActionCode.Idle];
    const attack = this.animations[BibiActionCode.Attack];

    attack.time = 0;
    attack.zeroSlopeAtEnd = false;
    attack.zeroSlopeAtStart = false;

    return { run, idle, attack };
  }

  private activateAllAnimations() {
    this.animations.forEach((action, idx) => {
      const actionWeight = idx === BibiActionCode.Idle ? 1 : 0;
      action.play();
      setAnimationWeight(action, actionWeight);
    });
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

  public update(timer: number) {
    super.update(timer);
    this.mixer.update(timer);
  }
}
