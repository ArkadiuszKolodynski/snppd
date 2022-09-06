import { GenerateSnapDto } from '../dto';
import { SnapService } from '../snap.service';

type ISnapService = { [P in keyof SnapService]: SnapService[P] };

export class SnapServiceMock implements ISnapService {
  generate(data: GenerateSnapDto): Promise<void> {
    return;
  }
}
