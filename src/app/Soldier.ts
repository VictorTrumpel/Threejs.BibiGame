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
  runAction: AnimationClip;
};

export class Soldier extends Body {
  private mixer: AnimationMixer;
  private skeleton: SkeletonHelper;

  private idleAction: AnimationAction;

  private runAction: AnimationAction;

  private cube: Mesh;

  private actions: AnimationAction[];

  constructor(skin: Group, actions: SoldierActions) {
    super(skin, Soldier.getPhysical());

    const { idleAction, runAction } = actions;

    this.mixer = new AnimationMixer(skin);
    this.skeleton = new SkeletonHelper(skin);

    this.idleAction = this.mixer.clipAction(idleAction);

    this.runAction = this.mixer.clipAction(runAction);

    this.actions = [this.idleAction, this.runAction];

    const geometry = new THREE.BoxGeometry(0.1, 0.1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.z = -1;
    this.skin.add(this.cube);

    const dotGeom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
    const dot = new THREE.Mesh(dotGeom, dotMaterial);
    dot.position.z = -0.5;
    this.cube.add(dot);

    this.activateAllActions();
  }

  private static getPhysical(): PhysicalBody {
    const vec3 = new Vec3(0.4, 0.8, 0.4);
    const body = new CANNON.Body({
      mass: 50000,
      position: new CANNON.Vec3(1, 5, 1),
      shape: new CANNON.Box(vec3),
    });

    // body.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), -Math.PI);

    return body;
  }

  private activateAllActions() {
    this.setWeight(this.idleAction, 1);
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

  public rotate(point: Vector3) {
    const { skin } = this;

    console.log('skin: ', skin);
    console.log('point: ', skin.getWorldPosition(point));

    this.skin.lookAt(skin.getWorldPosition(point));

    console.log(' ------ ------ ------');
  }

  public stop() {
    console.log(this.runAction);

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
