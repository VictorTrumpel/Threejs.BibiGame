import { ColorWorld } from './ColorWorld';
import { World as PhysicsWorld } from 'cannon-es';
import { Clock } from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import CannonDebugRenderer from '../utils/cannonDebugRenderer';
import * as TWEEN from '@tweenjs/tween.js';
import { Body } from './Body';

export class World {
  public colorWorld: ColorWorld = new ColorWorld();
  public physicsWorld: PhysicsWorld = new PhysicsWorld();
  public clock: Clock = new Clock();

  private worldBodies: Body[] = [];

  // For DEBUG
  private orbitControl = new OrbitControls(this.colorWorld.camera, this.colorWorld.renderer.domElement);
  private cannonDebug = new CannonDebugRenderer(this.colorWorld.scene, this.physicsWorld);

  constructor() {
    this.physicsWorld.gravity.set(0, -9.8, 0);
    this.orbitControl.enableDamping = true;
  }

  addBody(body: Body) {
    const { skin, physique } = body;
    const { colorWorld, physicsWorld, worldBodies } = this;

    colorWorld.scene.add(skin);
    physicsWorld.addBody(physique);
    worldBodies.push(body);
  }

  preload(): void {}

  start(): void {
    this.preload();
    this.loop();
  }

  loop(): void {
    const { clock, orbitControl, physicsWorld, colorWorld, loop, cannonDebug, worldBodies } = this;

    const time = clock.getDelta();

    physicsWorld.step(time);
    colorWorld.render();

    TWEEN.update();

    worldBodies.forEach((body) => body.update(time));

    // For DEBUG
    orbitControl.update();
    cannonDebug.update();

    // HOLD LOOP
    requestAnimationFrame(loop);
  }
}
