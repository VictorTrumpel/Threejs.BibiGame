import { Body } from './Body';

import {
  Group,
  Mesh,
  SkeletonHelper,
  AnimationMixer,
  AnimationAction,
  AnimationClip,
  Vector3,
  LineBasicMaterial,
  Quaternion,
} from 'three';
import { Body as PhysicalBody } from 'objects/Body';
import * as CANNON from 'cannon-es';
import { Vec3 } from 'cannon-es';
import * as THREE from 'three';

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

  private skinDirection: Vector3;

  constructor(skin: Group, actions: SoldierActions) {
    super(skin, Soldier.getPhysical());

    const { idleAction, walkAction, runAction } = actions;

    this.mixer = new AnimationMixer(skin);
    this.skeleton = new SkeletonHelper(skin);

    this.idleAction = this.mixer.clipAction(idleAction);
    this.walkAction = this.mixer.clipAction(walkAction);
    this.runAction = this.mixer.clipAction(runAction);

    this.actions = [this.idleAction, this.walkAction, this.runAction];

    const geometry = new THREE.BoxGeometry(0.1, 0.1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.z = -1;
    this.skin.add(cube);

    this.skinDirection = new Vector3(this.skin.position.x, 0, -1);

    this.activateAllActions();
  }

  private static getPhysical(): PhysicalBody {
    const vec3 = new Vec3(0.4, 0.8, 0.4);
    const body = new CANNON.Body({
      mass: 5000,
      position: new CANNON.Vec3(2, 5, 3),
      shape: new CANNON.Box(vec3),
    });

    // body.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), -Math.PI);

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

  public run() {
    this.setWeight(this.runAction, 1);
    this.setWeight(this.idleAction, 0);
  }

  public rotate(headRY: number) {
    const { skin, skinDirection } = this;

    this.skin.rotation.y += headRY - this.skin.rotation.y;

    console.log(' ------ ------ ------');
  }

  public stop() {
    this.runAction.fadeOut(600);

    this.setWeight(this.runAction, 0);
    this.setWeight(this.idleAction, 1);
  }

  public bindSkinToPhysics() {
    const { skin, physique } = this;

    const vector = new Vector3(...Object.values(physique.position));
    vector.y /= -1000;

    skin.position.copy(vector);

    // TODO:// maybe don't need at this an we will round ontly THREE.js skin
    // skin.quaternion.copy(new Quaternion(...Object.values(physique.quaternion)));
  }

  public update(timer: number) {
    this.bindSkinToPhysics();
    this.mixer.update(timer);
  }
}
