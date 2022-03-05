import { PhysicalBody } from './PhysicalBody';
import { Vector2, Vector3 } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Vec3 } from 'cannon-es';
import { Body } from 'objects/Body';

export class MovementBody extends PhysicalBody {
  readonly TIME_RATIO = 1000;
  readonly speed: number = 1.5;
  private currentTween?: TWEEN.Tween<any>;
  public isRunning: boolean;

  constructor(physique: Body) {
    super(physique);

    this.isRunning = false;
  }

  public moveToPoint(point: Vector3, onStart?: () => void, onStop?: () => void) {
    const { skin, physique, currentTween } = this;
    const { x, z } = point;

    skin.lookAt(point);

    const moveTime = this.getMovementTime(point, physique.position);

    currentTween?.stop();

    const tween = new TWEEN.Tween(physique.position);

    console.log();

    tween
      .to({ x, z }, moveTime)
      .start()
      .onStart(() => {
        // console.log('curr', this.currentTween?.getId());
        // console.log('new Tween', tween.getId());
        onStart?.();
      })
      // .onStop(() => console.log('onForceStop', tween.getId()))
      .onComplete(() => {
        onStop?.();
      });

    this.currentTween = tween;
  }

  private getMovementTime(point: Vector3, position: Vec3): number {
    const distance = new Vector2(point.x, point.z).distanceTo(new Vector2(position.x, position.z));

    return Math.abs(distance / this.speed) * this.TIME_RATIO;
  }
}
