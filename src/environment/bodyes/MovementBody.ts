import { PhysicalBody } from './PhysicalBody';
import { Vector2, Vector3, Object3D, Quaternion } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Vec3 } from 'cannon-es';
import { Body } from 'objects/Body';

export class MovementBody extends PhysicalBody {
  readonly TIME_RATIO = 1000;
  readonly speed: number = 3;

  private targetQuaternion?: Quaternion;
  private positionTween?: TWEEN.Tween<any>;

  constructor(physique: Body) {
    super(physique);
  }

  public moveToPoint(
    point: Vector3,
    onStart?: (tween: TWEEN.Tween<any>) => void,
    onStop?: (tween: TWEEN.Tween<any>) => void,
    onUpdate?: (tween: TWEEN.Tween<any>) => void
  ) {
    const { physique } = this;
    const { x, z } = point;

    this.positionTween?.stop();

    this.smoothLookAt(point);

    const positionTween = new TWEEN.Tween(physique.position);

    positionTween
      .to({ x, z }, this.getMovementTime(point, physique.position))
      .start()
      .onUpdate(() => onUpdate?.(positionTween))
      .onStart(() => onStart?.(positionTween))
      .onComplete(() => onStop?.(positionTween));

    this.positionTween = positionTween;
  }

  private smoothLookAt(point: Vector3) {
    const { skin } = this;

    const mock = new Object3D();

    mock.position.copy(skin.position);
    mock.lookAt(point);

    this.targetQuaternion = mock.quaternion.clone();
  }

  private getMovementTime(point: Vector3, position: Vec3): number {
    const distance = new Vector2(point.x, point.z).distanceTo(new Vector2(position.x, position.z));

    return Math.abs(distance / this.speed) * this.TIME_RATIO;
  }

  public update(timer: number) {
    super.update(timer);

    if (this.targetQuaternion) {
      this.skin.quaternion.slerp(this.targetQuaternion, 0.2);
    }
  }
}
