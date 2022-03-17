import { MovementBody } from './MovementBody';
import { IBody } from './IBody';
import { AnimationAction, AnimationMixer, TextureLoader } from 'three';
import { Body } from 'objects/Body';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import tigroModel from '../../../assets/models/primo_tiger_sketchfab.fbx';
import tigroTexture from '../../../assets/textures/bibi_gamer_tex.png';

export class TigroBody extends MovementBody implements IBody {
  private mixer: AnimationMixer;
  readonly scale = 0.0015;

  protected animations: AnimationAction[] = [];

  constructor(physique: Body, name: string) {
    super(physique, name);
    this.mixer = new AnimationMixer(this.skin);
  }

  public async loadModel() {
    const { scale } = this;

    const tigroFbx = await new FBXLoader().loadAsync(tigroModel);
    const texture = await new TextureLoader().loadAsync(tigroTexture);
    this.mixer = new AnimationMixer(tigroFbx);

    console.log(tigroFbx);

    tigroFbx.scale.set(scale, scale, scale);

    this.skin = tigroFbx;
  }
}
