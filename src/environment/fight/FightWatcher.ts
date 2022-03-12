import { MovementBody } from '../bodyes/MovementBody';

class FightWatcher {
  private fightBodies: Map<string, MovementBody> = new Map();

  public addBody(body: MovementBody) {
    const { id } = body.userData;

    this.fightBodies.set(id, body);
  }

  public dispatch(id: string, value: number) {
    const body = this.fightBodies.get(id);
    if (!body) return;
    body.userData.health += value;
  }
}

const fightWatcher = new FightWatcher();

export default fightWatcher;
