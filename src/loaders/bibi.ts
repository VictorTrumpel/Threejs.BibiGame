import BibiPhysics from '../physics/BibiPhysics';
import BibiCharacter from '../app/BibiCharacter';
import { world } from '../main';
import { Vector2, Object3D, Raycaster } from 'three';

const bibi = new BibiCharacter(BibiPhysics);

(async () => {
  await bibi.loadModel();
  world.addBody(bibi);

  const raycaster = new Raycaster();

  window.addEventListener('mousedown', onMouseDown, false);

  function onMouseDown(e: any) {
    const mouse2D = new Vector2(0, 0);

    mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse2D, world.colorWorld.camera);
    const intersects = raycaster.intersectObjects(world.colorWorld.scene.children, false);

    if (intersects.length > 0) {
      const intersect = intersects[0];

      const element: Object3D = intersect.object;
      const point = intersect.point;

      if (element.userData.name !== 'CUBE') {
        bibi.moveToPoint(point);
      }
    }
  }
})();
