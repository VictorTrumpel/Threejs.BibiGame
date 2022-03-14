import { BibiBody } from './BibiBody';
import { setAnimationWeight } from '../../helpers/setAnimationWeight';
import { getPointsLength } from '../../helpers/getPointsLength';
import fightWatcher from '../fight/FightWatcher';
import { aim, Aim } from '../common/Aim';

export class BibiActionBody extends BibiBody {
  private isRunning?: boolean;
  private isAttacking?: boolean;
  private aim: Aim = aim;

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

    setAnimationWeight(idle, 1);

    run.crossFadeTo(idle, 0.3, true);

    this.isRunning = false;
  }

  private hit() {
    const { charge } = this.userData;
    if (!charge) return;

    fightWatcher.dispatch(charge.userData.id, -0.1);
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

    setTimeout(() => this.hit(), (duration / 2) * 1000);

    setTimeout(() => this.stopAttack(), duration * 1000);
  }

  private stopAttack() {
    const { attack, idle } = this.actions();

    attack.time = 0;

    setAnimationWeight(idle, 1);

    attack.crossFadeTo(idle, 0.5, true);

    this.isAttacking = false;
  }

  private highlightTarget() {
    const { charge } = this.userData;

    if (!charge) {
      this.aim.visible = false;
      return;
    }

    this.aim.visible = true;
    this.aim.position.z = charge.position.z;
    this.aim.position.x = charge.position.x;
  }

  public update(timer: number) {
    super.update(timer);
    const { userData } = this;

    this.highlightTarget();

    userData.isMoving ? this.run() : this.stop();
  }
}
