import { BibiBody } from './BibiBody';
import { setAnimationWeight } from '../../helpers/setAnimationWeight';
import { getPointsLength } from '../../helpers/getPointsLength';
import { Vector3 } from 'three';

export class BibiActionBody extends BibiBody {
  private isRunning?: boolean;
  private isAttacking?: boolean;

  private run() {
    if (this.isRunning) return;
    const { run, idle } = this.actions();

    setAnimationWeight(run, 1);

    idle.crossFadeTo(run, 0.5, true);

    this.isRunning = true;
  }

  private stop() {
    if (!this.isRunning) return;

    const { run, idle } = this.actions();

    run.crossFadeTo(idle, 0.3, true);

    this.isRunning = false;
  }

  private alwaysLookAtEnemy() {}

  private attack() {
    const { charge } = this.userData;
    const { attack, idle } = this.actions();

    const { position: targetPosition } = charge || {};
    const { position: bodyPosition } = this.skin;

    const length = getPointsLength(targetPosition, bodyPosition);

    if (length > this.range) {
      this.stopAttack();
      return;
    }

    if (this.isAttacking) return;

    setAnimationWeight(attack, 1);
    setAnimationWeight(idle, 0);

    this.isAttacking = true;
  }

  private stopAttack() {
    if (!this.isAttacking) return;

    const { attack, idle } = this.actions();

    setAnimationWeight(attack, 0);
    setAnimationWeight(idle, 1);

    this.isAttacking = false;
  }

  update(timer: number) {
    super.update(timer);
    const { userData } = this;

    userData.isMoving ? this.run() : this.stop();

    userData.isCharged ? this.attack() : this.stopAttack();
  }
}
