import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { PageDto, PageMetaDto } from '@snppd/shared';
import { plainToInstance } from 'class-transformer';
import { SnapDao } from '../../dao/snap.dao';
import { SnapResponseDto } from '../../dto';
import { FindSnapsQuery } from '../impl/find-snaps.command';

@QueryHandler(FindSnapsQuery)
export class FindSnapsHandler implements ICommandHandler<FindSnapsQuery> {
  constructor(private readonly snapDao: SnapDao) {}

  async execute({ pageOptionsDto, userId }: FindSnapsQuery): Promise<PageDto<SnapResponseDto>> {
    const [snaps, itemCount] = await this.snapDao.findManyAndCount(pageOptionsDto, userId);
    const data = snaps.map((snap) => plainToInstance(SnapResponseDto, snap));
    const meta = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, meta);
  }
}
