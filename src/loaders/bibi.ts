import BibiPhysics from '../physics/BibiPhysics';
import BibiCharacter from '../environment/characters/BibiCharacter';
import { world } from '../environment/worlds/World';

const bibi = new BibiCharacter(BibiPhysics);

(async () => {
  await bibi.loadModel();
  world.addBody(bibi);

  // CONTROLLERS
  window.addEventListener('mousedown', bibi.mouseEvent.bind(bibi), false);
})();
