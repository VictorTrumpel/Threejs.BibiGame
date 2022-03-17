import tigroModel from '../../../assets/models/primo_tiger_sketchfab.fbx';
import tigroTexture from '../../../assets/textures/primo_tigro_face.png';

import { MovementBody } from './MovementBody';
import { IBody } from './IBody';
import { AnimationAction, AnimationMixer, TextureLoader } from 'three';
import { Body } from 'objects/Body';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { setAnimationWeight } from '../../helpers/setAnimationWeight';

export enum TigroActionCode {
  // eslint-disable-next-line no-unused-vars
  Run = 2,
  // eslint-disable-next-line no-unused-vars
  Idle = 5,
  Attack = 6,
}

export class TigroBody extends MovementBody implements IBody {
  private mixer: AnimationMixer;
  readonly scale = 0.0015;

  protected animations: AnimationAction[] = [];

  constructor(physique: Body, name: string) {
    super(physique, name);
    this.mixer = new AnimationMixer(this.skin);
  }

  private activateAllAnimations() {
    this.animations.forEach((action, idx) => {
      const actionWeight = idx === TigroActionCode.Idle ? 1 : 0;
      action.play();
      setAnimationWeight(action, actionWeight);
    });
  }

  public async loadModel() {
    const { scale } = this;

    const tigroFbx = await new FBXLoader().loadAsync(tigroModel);
    const texture = await new TextureLoader().loadAsync(tigroTexture);
    this.mixer = new AnimationMixer(tigroFbx);

    tigroFbx?.scale.set(scale, scale, scale);

    this.skin = tigroFbx;
    this.animations = tigroFbx.animations.map((animation) => this.mixer.clipAction(animation));
    this.activateAllAnimations();

<<<<<<< HEAD
    this.skin = tigroFbx;
=======
    tigroFbx?.children.map((child) => {
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
>>>>>>> 0d541b8ebfe8d4b7a8d6e296d6c11c0ea70cc15d
  }
}
