import EnemyPhysics from '../physics/EnemyPhysics';
import EnemyCharacter from '../environment/characters/EnemyCharacter';
import { world } from '../environment/worlds/World';

const enemy = new EnemyCharacter(EnemyPhysics);

(async () => {
  await enemy.loadModel();
  world.addBody(enemy);

  // CONTROLLERS
})();
