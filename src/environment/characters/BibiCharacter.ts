import { Vector3, Object3D } from 'three';

import { Body } from 'objects/Body';
import { getMouse2DCords } from '../../helpers/getMouse2DCords';
import { BibiActionBody } from '../bodyes/BibiActionBody';
import { getRaycasterIntersects } from '../../helpers/getRaycasterIntersects';

class BibiCharacter extends BibiActionBody {
  readonly scale = 0.0015;

  constructor(physique: Body) {
    super(physique);
  }

  public mouseEvent(e: MouseEvent) {
    const mouse2D = getMouse2DCords(e);

    const [intersect] = getRaycasterIntersects(mouse2D);
    const { object, point } = intersect || {};

    if (e.button === 0) this.moveEvent(object, point);
    if (e.button === 2) this.fightEvent(object);
  }

  private fightEvent(object: Object3D) {
    if (!object?.userData) return;
    this.moveToTarget(object);
  }

  private moveEvent(object: Object3D, point: Vector3) {
    if (!object?.userData?.isGround) return;
    this.moveToPoint(point);
  }

  public testOnKeyDownEvent(e: KeyboardEvent) {
    if (e.key === '1') {
      this.attack();
    }
  }
}

export default BibiCharacter;
