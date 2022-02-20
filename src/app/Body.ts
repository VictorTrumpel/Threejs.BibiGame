import { Mesh, Quaternion, Vector3 } from 'three';
import { Body as PhysicalBody } from 'objects/Body';

export class Body {
  public skin: Mesh;
  public physique: PhysicalBody;

  constructor(skin: Mesh, physique: PhysicalBody) {
    this.skin = skin;
    this.physique = physique;
  }

  private bindSkinToPhysics() {
    const { skin, physique } = this;

    skin.position.copy(new Vector3(...Object.values(physique.position)));
    skin.quaternion.copy(new Quaternion(...Object.values(physique.quaternion)));
  }

  public update(timer: number) {
    console.log(timer);

    this.bindSkinToPhysics();
  }
}
