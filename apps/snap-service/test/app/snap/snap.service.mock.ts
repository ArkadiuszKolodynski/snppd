import { GenerateSnapDto } from '../../../src/app/snap/dto';
import { SnapService } from '../../../src/app/snap/snap.service';

type ISnapService = { [P in keyof SnapService]: SnapService[P] };

export class SnapServiceMock implements ISnapService {
  onApplicationBootstrap(): Promise<void> {
    return;
  }

  generate(data: GenerateSnapDto): Promise<void> {
    return;
  }

  delete(id: string): Promise<void> {
    return;
  }
}
