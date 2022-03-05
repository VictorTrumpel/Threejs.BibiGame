import { Group, Mesh, Vector3 } from 'three';
import { Body } from 'objects/Body';
import { PreloadSkin } from '../../preloaders/PreloadSkin';

export type Skin = Group | Mesh;

export type BodyUserData = {
  objectType: string;
};

export class PhysicalBody {
  public skin: Group | Mesh;
  public physique: Body;

  constructor(physique: Body, skin?: Skin) {
    this.physique = physique;
    this.skin = skin || PreloadSkin;
  }

  public bindSkinToPhysics() {
    const { skin, physique } = this;

    skin.position.copy(new Vector3(...Object.values(physique.position)));
  }

  // eslint-disable-next-line no-unused-vars
  public update(timer: number) {
    this.bindSkinToPhysics();
  }
}
