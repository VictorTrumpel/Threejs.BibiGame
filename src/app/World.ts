import { ColorWorld } from './ColorWorld';
import { World as PhysicsWorld } from 'cannon-es';
import { Clock } from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import CannonDebugRenderer from '../utils/cannonDebugRenderer';
import * as TWEEN from '@tweenjs/tween.js';
import { PhysicalBody } from './PhysicalBody';

export class World {
  public colorWorld: ColorWorld = new ColorWorld();
  public physicsWorld: PhysicsWorld = new PhysicsWorld();
  private clock: Clock = new Clock();

  private worldBodies: PhysicalBody[] = [];

  // For DEBUG
  private orbitControl: OrbitControls = new OrbitControls(this.colorWorld.camera, this.colorWorld.renderer.domElement);
  private cannonDebug: CannonDebugRenderer = new CannonDebugRenderer(this.colorWorld.scene, this.physicsWorld);

  constructor() {
    this.physicsWorld.gravity.set(0, -9.8, 0);
    //this.orbitControl.enableDamping = true;
  }

  addBody(body: PhysicalBody) {
    const { skin, physique } = body;
    const { colorWorld, physicsWorld, worldBodies } = this;

    colorWorld.scene.add(skin);
    physicsWorld.addBody(physique);
    worldBodies.push(body);
  }

  start(): void {
    this.loop();
  }

  private loop(): void {
    const { clock, worldBodies, cannonDebug, physicsWorld, colorWorld } = this;

    const time = clock.getDelta();

    physicsWorld.step(time);
    colorWorld.render();

    TWEEN.update();

    worldBodies.forEach((body) => body.update(time));

    // For DEBUG
    cannonDebug.update();

    // HOLD LOOP
    requestAnimationFrame(this.loop.bind(this));
  }
}
