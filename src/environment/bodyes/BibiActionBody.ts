import { BibiBody } from './BibiBody';
import { setAnimationWeight } from '../../helpers/setAnimationWeight';
import { getPointsLength } from '../../helpers/getPointsLength';

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

  public attack() {
    if (this.isAttacking) return;

    const { charge } = this.userData;

    if (!charge?.userData?.isEnemy) return;

    const { attack, idle } = this.actions();

    const { position: targetPosition } = charge || {};
    const { position: bodyPosition } = this.skin;

    const length = getPointsLength(targetPosition, bodyPosition);

    if (length > this.range) return;

    // @ts-ignore
    const duration = attack._clip.duration;

    idle.crossFadeTo(attack, 0.5, true);

    setAnimationWeight(attack, 1);

    this.isAttacking = true;

    setTimeout(() => this.stopAttack(), duration * 1000);
  }

  private stopAttack() {
    const { attack, idle } = this.actions();

    attack.time = 0;

    setAnimationWeight(idle, 1);

    attack.crossFadeTo(idle, 0.5, true);

    this.isAttacking = false;
  }

  update(timer: number) {
    super.update(timer);
    const { userData } = this;

    userData.isMoving ? this.run() : this.stop();
  }
}
