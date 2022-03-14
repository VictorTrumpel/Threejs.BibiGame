import { MovementBody } from '../bodyes/MovementBody';
import { Body } from 'objects/Body';
import { BoxGeometry, MeshBasicMaterial, Mesh, Quaternion, PlaneGeometry, Object3D } from 'three';
import * as THREE from 'three';

class EnemyCharacter extends MovementBody {
  private healthBar: Object3D;

  constructor(physique: Body, name: string) {
    super(physique, name);
    this.userData = {
      ...this.userData,
      objectType: 'EnemyCharacter',
      isEnemy: true,
    };
    this.healthBar = this.generateHealthBar();
  }

  public loadModel() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: '#633232' });
    this.skin = new Mesh(geometry, material);
    this.skin.userData = this.userData;

    this.skin.add(this.healthBar);
  }

  private generateHealthBar(): Object3D {
    const healthBarGeom = new PlaneGeometry(1, 0.2);
    const healthBarMaterial = new MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide });
    const healthBar = new Mesh(healthBarGeom, healthBarMaterial);
    healthBar.position.y = 1.3;
    healthBar.scale.x = 1;
    return healthBar;
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
