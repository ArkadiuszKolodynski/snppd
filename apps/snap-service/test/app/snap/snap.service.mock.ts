import { PageDto, PageOptionsDto } from '@snppd/shared';
import { GenerateSnapDto, SnapResponseDto } from '../../../src/app/snap/dto';
import { UpdateSnapDto } from '../../../src/app/snap/dto/update-snap.dto';
import { SnapService } from '../../../src/app/snap/snap.service';

type ISnapService = { [P in keyof SnapService]: SnapService[P] };

export class SnapServiceMock implements ISnapService {
  onApplicationBootstrap(): Promise<void> {
    return;
  }

  findMany(pageOptionsDto: PageOptionsDto, userId: string): Promise<PageDto<SnapResponseDto>> {
    return;
  }

  findById(id: string, userId: string): Promise<SnapResponseDto> {
    return;
  }

  generate(data: GenerateSnapDto): Promise<void> {
    return;
  }

  update(id: string, updateSnapDto: UpdateSnapDto, userId: string): Promise<void> {
    return;
  }

  delete(id: string): Promise<void> {
    return;
  }
}
