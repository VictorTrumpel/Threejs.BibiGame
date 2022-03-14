import { TigroBody } from '../bodyes/TigroBody';
import { Body } from 'objects/Body';

class TigroCharacter extends TigroBody {
  constructor(physique: Body, name: string) {
    super(physique, name);
  }
}

export default TigroCharacter;
