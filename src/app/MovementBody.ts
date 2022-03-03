import { PhysicalBody } from './PhysicalBody';
import { Vector2, Vector3 } from 'three';
import { Tween } from '@tweenjs/tween.js';
import { Vec3 } from 'cannon-es';

export class MovementBody extends PhysicalBody {
  readonly TIME_RATIO = 1000;
  private speed: number = 500;

  public moveToPoint(point: Vector3, onStop?: () => void) {
    const { skin, physique } = this;
    const { x, z } = point;

    skin.lookAt(point);

    const tween = new Tween(physique);
    const moveTime = this.getMovementTime(point, physique.position);

    tween
      .to({ x, z }, moveTime)
      .start()
      .onComplete(() => onStop?.());
  }

  private getMovementTime(point: Vector3, position: Vec3): number {
    const distance = new Vector2(point.x, point.z).distanceTo(new Vector2(position.x, position.z));

    return Math.abs(distance / this.speed) * this.TIME_RATIO;
  }
}
