import { GenerateSnapDto } from '../../../src/app/snap/dto';
import { SnapService } from '../../../src/app/snap/snap.service';

type ISnapService = { [P in keyof SnapService]: SnapService[P] };

export class SnapServiceMock implements ISnapService {
  generate(data: GenerateSnapDto): Promise<void> {
    return;
  }
}
