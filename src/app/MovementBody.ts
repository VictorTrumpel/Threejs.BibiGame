import { PhysicalBody } from './PhysicalBody';
import { Vector2, Vector3 } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Vec3 } from 'cannon-es';
import { Body } from 'objects/Body';

export class MovementBody extends PhysicalBody {
  readonly TIME_RATIO = 1000;
  readonly speed: number = 1.5;

  constructor(physique: Body) {
    super(physique);
  }

  public moveToPoint(point: Vector3, onStop?: () => void) {
    const { skin, physique } = this;
    const { x, z } = point;

    skin.lookAt(point);

    const moveTime = this.getMovementTime(point, physique.position);

    new TWEEN.Tween(physique.position)
      .to({ x, z }, moveTime)
      .start()
      .onComplete(() => onStop?.());
  }

  private getMovementTime(point: Vector3, position: Vec3): number {
    const distance = new Vector2(point.x, point.z).distanceTo(new Vector2(position.x, position.z));

    return Math.abs(distance / this.speed) * this.TIME_RATIO;
  }
}
