import { Group, Mesh, Quaternion, Vector3 } from 'three';
import { Body as PhysicalBody } from 'objects/Body';

export class Body {
  public skin: Group | Mesh;
  public physique: PhysicalBody;

  constructor(skin: Group | Mesh, physique: PhysicalBody) {
    console.log('physique: ', physique);

    this.skin = skin;
    this.physique = physique;
  }

  public bindSkinToPhysics() {
    const { skin, physique } = this;

    skin.position.copy(new Vector3(...Object.values(physique.position)));
    skin.quaternion.copy(new Quaternion(...Object.values(physique.quaternion)));
  }

  public update(timer: number) {
    this.bindSkinToPhysics();
  }
}
