import TigroPhysics from '../physics/TigroPhysics';
import TigroCharacter from '../environment/characters/TigroCharacter';
import world from '../environment/worlds/World';
import fightWatcher from '../environment/fight/FightWatcher';

const tigro = new TigroCharacter(TigroPhysics, 'Tigro');

(async () => {
  await tigro.loadModel();

  world.addBody(tigro);
  fightWatcher.addBody(tigro);

  // CONTROLLERS
})();
