import { MovementBody } from '../bodyes/MovementBody';
import { Body } from 'objects/Body';
import { BodyUserData } from '../bodyes/PhysicalBody';
import { BoxGeometry, MeshBasicMaterial, Mesh, Quaternion } from 'three';

export type EnemyUserData = BodyUserData & {
  objectType: string;
  isEnemy: boolean;
  health: number;
};

class EnemyCharacter extends MovementBody {
  constructor(physique: Body, name: string) {
    super(physique, name);
    this.userData = {
      ...this.userData,
      objectType: 'EnemyCharacter',
      isEnemy: true,
      health: 20,
    };
  }

  public loadModel() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: '#633232' });
    this.skin = new Mesh(geometry, material);
    this.skin.userData = this.userData;
  }

  public update(timer: number) {
    super.update(timer);

    this.skin.quaternion.copy(new Quaternion(...Object.values(this.physique.quaternion)));
  }
}

export default EnemyCharacter;
