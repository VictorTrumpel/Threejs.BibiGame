import BibiPhysics from '../physics/BibiPhysics';
import BibiCharacter from '../environment/characters/BibiCharacter';
import world from '../environment/worlds/World';
import fightWatcher from '../environment/fight/FightWatcher';

const bibi = new BibiCharacter(BibiPhysics, 'BiBiHero');

(async () => {
  await bibi.loadModel();

  world.addBody(bibi);
  fightWatcher.addBody(bibi);

  // CONTROLLERS
  window.addEventListener('mousedown', bibi.mouseEvent.bind(bibi), false);
  window.addEventListener('keydown', bibi.testOnKeyDownEvent.bind(bibi), false);
})();
