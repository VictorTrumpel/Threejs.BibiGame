import { PhysicalBody } from './PhysicalBody';
import { Vector2, Vector3, Object3D, Quaternion } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Vec3 } from 'cannon-es';
import { Body } from 'objects/Body';
import { getPointsLength } from '../../helpers/getPointsLength';

type MoveToPointCallbacks = Partial<{
  onStart: (tween: TWEEN.Tween<any>) => void;
  onStop: (tween: TWEEN.Tween<any>) => void;
  onUpdate: (tween: TWEEN.Tween<any>) => void;
}>;

export type Charge = {
  userData: MovementUserData;
  position: Vector3;
};

type MovementUserData = {
  id: string;
  objectType?: string;
  isEnemy?: boolean;
  health: number;
  isCharged: boolean;
  isMoving: boolean;
  charge: Charge | null;
};

export class MovementBody extends PhysicalBody {
  readonly TIME_RATIO = 1000;
  readonly speed: number = 3;
  readonly range: number = 1.5;

  private targetQuaternion?: Quaternion;
  private positionTween?: TWEEN.Tween<any>;

  public userData: MovementUserData;

  constructor(physique: Body, name: string) {
    super(physique);

    this.userData = {
      id: name,
      isCharged: false,
      isMoving: false,
      charge: null,
      health: 1,
    };
  }

  protected moveToPoint(point: Vector3, callbacks?: MoveToPointCallbacks) {
    const { onStart, onStop, onUpdate } = callbacks || {};
    const { physique } = this;
    const { x, z } = point;

    this.positionTween?.stop();

    this.smoothLookAt(point);

    const positionTween = new TWEEN.Tween(physique.position);

    positionTween
      .to({ x, z }, this.getMovementTime(point, physique.position))
      .start()
      .onUpdate(() => onUpdate?.(positionTween))
      .onStart(() => {
        this.userData.isMoving = true;
        onStart?.(positionTween);
      })
      .onComplete(() => {
        this.userData.isMoving = false;
        onStop?.(positionTween);
      });

    this.positionTween = positionTween;
  }

  protected moveToTarget(target: Object3D) {
    if (!target.userData.isEnemy) {
      this.userData.isCharged = false;
      this.userData.charge = null;
      return;
    }

    this.userData.isCharged = true;
    this.userData.charge = target as unknown as Charge;

    const { position: targetPosition } = target;
    const { position: bodyPosition } = this.skin;
    const { x, z } = targetPosition;

    const length = () => getPointsLength(targetPosition, bodyPosition);

    if (length() <= this.range) return;

    this.moveToPoint(new Vector3(x, 0, z), {
      onUpdate: (tween) => {
        if (!(length() <= this.range)) return;
        tween.stop();
        this.userData.isMoving = false;
      },
    });
  }

  protected smoothLookAt(point: Vector3) {
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
