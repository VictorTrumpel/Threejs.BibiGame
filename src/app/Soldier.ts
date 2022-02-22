import { Body } from './Body';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import soldier from '../models/Soldier.glb';
import {
  Group,
  Mesh,
  SkeletonHelper,
  AnimationMixer,
  AnimationAction,
  AnimationClip,
  Vector3,
  Quaternion,
} from 'three';
import { Body as PhysicalBody } from 'objects/Body';
import * as CANNON from 'cannon-es';
import { Vec3 } from 'cannon-es';

export type SoldierActions = {
  idleAction: AnimationClip;
  walkAction: AnimationClip;
  runAction: AnimationClip;
};

export class Soldier extends Body {
  private mixer: AnimationMixer;
  private skeleton: SkeletonHelper;

  private idleAction: AnimationAction;
  private walkAction: AnimationAction;
  private runAction: AnimationAction;

  private actions: AnimationAction[];

  constructor(skin: Group, actions: SoldierActions) {
    super(skin, Soldier.getPhysical());

    const { idleAction, walkAction, runAction } = actions;

    this.mixer = new AnimationMixer(skin);
    this.skeleton = new SkeletonHelper(skin);

    this.idleAction = this.mixer.clipAction(idleAction);
    this.walkAction = this.mixer.clipAction(walkAction);
    this.runAction = this.mixer.clipAction(runAction);

    this.actions = [this.idleAction, this.walkAction, this.runAction];

    this.activateAllActions();
  }

  private static getPhysical(): PhysicalBody {
    const vec3 = new Vec3(0.4, 0.8, 0.4);
    const body = new CANNON.Body({
      mass: 92,
      position: new CANNON.Vec3(0, 5, 0),
      shape: new CANNON.Box(vec3),
    });

    body.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), -Math.PI);

    return body;
  }

  private activateAllActions() {
    this.setWeight(this.idleAction, 1);
    this.setWeight(this.walkAction, 0);
    this.setWeight(this.runAction, 0);

    this.actions.forEach(function (action: AnimationAction) {
      action.play();
    });
  }

  private setWeight(action: AnimationAction, weight: number) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }

  public rund() {
    this.setWeight(this.runAction, 1);
    this.setWeight(this.idleAction, 0);
  }

  public rotate(y: number) {
    this.physique.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / y);
  }

  public stop() {
    this.setWeight(this.runAction, 0);
    this.setWeight(this.idleAction, 1);
  }

  public bindSkinToPhysics() {
    const { skin, physique } = this;

    const vector = new Vector3(...Object.values(physique.position));
    vector.y /= -1000;

    skin.position.copy(vector);
    skin.quaternion.copy(new Quaternion(...Object.values(physique.quaternion)));
  }

  public update(timer: number) {
    this.bindSkinToPhysics();
    this.mixer.update(timer);
  }
}
