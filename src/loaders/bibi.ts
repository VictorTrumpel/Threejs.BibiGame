import BibiPhysics from '../physics/BibiPhysics';
import BibiCharacter from '../app/BibiCharacter';
import { world } from '../main';

const bibi = new BibiCharacter(BibiPhysics);

(async () => {
  await bibi.loadModel();
  world.addBody(bibi);

  // CONTROLLERS
  window.addEventListener('mousedown', bibi.moveEvent.bind(bibi), false);
})();
