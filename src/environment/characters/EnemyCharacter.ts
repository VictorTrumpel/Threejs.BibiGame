import { MovementBody } from '../bodyes/MovementBody';
import { Body } from 'objects/Body';
import { BoxGeometry, MeshBasicMaterial, Mesh, Quaternion } from 'three';
import { HealthBar } from '../common/HealthBar';

class EnemyCharacter extends MovementBody {
  private healthBar: HealthBar = new HealthBar();

  constructor(physique: Body, name: string) {
    super(physique, name);
    this.userData = {
      ...this.userData,
      objectType: 'EnemyCharacter',
      isEnemy: true,
    };
  }

  public loadModel() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: '#633232' });
    this.skin = new Mesh(geometry, material);
    this.skin.userData = this.userData;

    this.skin.add(this.healthBar);

    this.healthBar.position.y = 1.2;
  }

  private updateHealthBar() {
    if (this.healthBar.scale.x === this.userData.health) return;
    if (this.healthBar.scale.x <= 0) return;
    this.healthBar.scale.x = this.userData.health;
  }

  public update(timer: number) {
    super.update(timer);
    this.updateHealthBar();
    this.skin.quaternion.copy(new Quaternion(...Object.values(this.physique.quaternion)));
  }
}

export default EnemyCharacter;
