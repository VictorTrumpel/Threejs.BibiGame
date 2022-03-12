import EnemyPhysics from '../physics/EnemyPhysics';
import EnemyCharacter from '../environment/characters/EnemyCharacter';
import world from '../environment/worlds/World';
import fightWatcher from '../environment/fight/FightWatcher';
import { Vec3 } from 'cannon-es';

const enemy1 = new EnemyCharacter(EnemyPhysics(new Vec3(2, 0.5, 2)), 'enemy1');
const enemy2 = new EnemyCharacter(EnemyPhysics(new Vec3(3, 0.5, -7)), 'enemy2');
const enemy3 = new EnemyCharacter(EnemyPhysics(new Vec3(-7, 0.5, 3)), 'enemy3');

const enemys: EnemyCharacter[] = [enemy1, enemy2, enemy3];

(async () => {
  enemys.forEach((enemy) => {
    enemy.loadModel();
    world.addBody(enemy);
    fightWatcher.addBody(enemy);
  });

  // CONTROLLERS
})();
