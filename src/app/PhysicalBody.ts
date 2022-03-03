import { Group, Mesh, Vector3 } from 'three';
import { Body } from 'objects/Body';

export class PhysicalBody {
  public skin: Group | Mesh;
  public physique: Body;

  constructor(skin: Group | Mesh, physique: Body) {
    this.skin = skin;
    this.physique = physique;
  }

  public bindSkinToPhysics() {
    const { skin, physique } = this;

    skin.position.copy(new Vector3(...Object.values(physique.position)));
  }

  public update(timer: number) {
    this.bindSkinToPhysics();
  }
}
