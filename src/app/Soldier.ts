import { Body } from './Body';

import { Group, SkeletonHelper, AnimationMixer, AnimationAction, AnimationClip, Vector3 } from 'three';
import { Body as PhysicalBody } from 'objects/Body';
import * as CANNON from 'cannon-es';
import { Vec3 } from 'cannon-es';

export type SoldierActions = {
  idleAction: AnimationClip;
  runAction: AnimationClip;
  ultAction: AnimationClip;
};

export class Soldier extends Body {
  private mixer: AnimationMixer;
  private skeleton: SkeletonHelper;

  private idleAction: AnimationAction;
  private runAction: AnimationAction;
  private ultAction: AnimationAction;

  private actions: AnimationAction[];

  constructor(skin: Group, actions: SoldierActions) {
    const shape = new CANNON.Box(new CANNON.Vec3(0.4, 0.6, 0.4));
    const body = new CANNON.Body({
      mass: 1000,
      position: new Vec3(0, 0.5, 0),
    });

    body.addShape(shape);

    super(skin, body);

    const { idleAction, runAction, ultAction } = actions;

    this.mixer = new AnimationMixer(skin);
    this.skeleton = new SkeletonHelper(skin);

    this.idleAction = this.mixer.clipAction(idleAction);
    this.runAction = this.mixer.clipAction(runAction);
    this.ultAction = this.mixer.clipAction(ultAction);

    this.actions = [this.idleAction, this.runAction, this.ultAction];

    this.skin.position.copy(new Vector3(1, 0, 1));

    console.log(this.skin.position);

    this.activateAllActions();
  }

  private static getPhysical(): PhysicalBody {
    const vec3 = new Vec3(0.4, 0.8, 0.4);
    return new CANNON.Body({
      mass: 70,
      position: new CANNON.Vec3(1, 5, 1),
      shape: new CANNON.Box(vec3),
    });
  }

  private activateAllActions() {
    this.setWeight(this.idleAction, 1);
    this.setWeight(this.runAction, 0);
    this.setWeight(this.ultAction, 0);

    this.actions.forEach(function (action: AnimationAction) {
      action.play();
    });
  }

  private setWeight(action: AnimationAction, weight: number) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }

  public run() {
    this.setWeight(this.runAction, 1);
    this.setWeight(this.idleAction, 0);
    this.setWeight(this.ultAction, 0);
  }

  public stop() {
    this.setWeight(this.runAction, 0);
    this.setWeight(this.idleAction, 1);
  }

  public ult() {
    this.setWeight(this.idleAction, 0);
    this.setWeight(this.runAction, 0);
    this.setWeight(this.ultAction, 1);
  }

  public rotate(point: Vector3) {
    const { skin } = this;

    this.skin.lookAt(skin.getWorldPosition(point));

    console.log(' ------ ------ ------');
  }

  public bindSkinToPhysics() {
    const { skin, physique } = this;

    const vector = new Vector3(...Object.values(physique.position));
    vector.y = 0;

    skin.position.copy(vector);

    // TODO:// maybe don't need at this an we will round ontly THREE.js skin
    // skin.quaternion.copy(new Quaternion(...Object.values(physique.quaternion)));
  }

  public update(timer: number) {
    this.bindSkinToPhysics();
    this.mixer.update(timer);
  }
}
