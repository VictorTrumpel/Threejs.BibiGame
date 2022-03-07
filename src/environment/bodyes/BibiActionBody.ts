import { BibiBody } from './BibiBody';
import { setAnimationWeight } from '../../helpers/setAnimationWeight';
import { Object3D } from 'three';
import { getPointsLength } from '../../helpers/getPointsLength';

export class BibiActionBody extends BibiBody {
  private isRunning?: boolean;

  public run() {
    if (this.isRunning) return;
    const { run, idle } = this.actions();

    setAnimationWeight(run, 1);

    idle.crossFadeTo(run, 0.5, true);

    this.isRunning = true;
  }

  public stop() {
    if (!this.isRunning) return;

    const { run, idle } = this.actions();

    setAnimationWeight(idle, 1);

    run.crossFadeTo(idle, 0.3, true);

    this.isRunning = false;
  }

  public attack() {
    const { charge } = this.userData;
    const { attack, idle } = this.actions();

    if (!charge?.userData.isEnemy) {
      setAnimationWeight(attack, 0);
      setAnimationWeight(idle, 1);
      return;
    }

    const { position: targetPosition } = charge || {};
    const { position: bodyPosition } = this.skin;

    const length = getPointsLength(targetPosition, bodyPosition);

    if (length > this.range) {
      setAnimationWeight(attack, 0);
      return;
    }

    setAnimationWeight(attack, 1);
    setAnimationWeight(idle, 0);
  }

  update(timer: number) {
    super.update(timer);
    const { userData } = this;

    userData.isMoving ? this.run() : this.stop();

    this.attack();
  }
}
