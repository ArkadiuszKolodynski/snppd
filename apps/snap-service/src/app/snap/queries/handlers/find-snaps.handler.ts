import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { PageDto, PageMetaDto } from '@snppd/shared';
import { plainToInstance } from 'class-transformer';
import { SnapResponseDto } from '../../dto';
import { SnapRepository } from '../../repositories/snap.repository';
import { FindSnapsQuery } from '../impl/find-snaps.command';

@QueryHandler(FindSnapsQuery)
export class FindSnapsHandler implements ICommandHandler<FindSnapsQuery> {
  constructor(private readonly repository: SnapRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute({ pageOptionsDto, userId }: FindSnapsQuery): Promise<PageDto<SnapResponseDto>> {
    const [snaps, itemCount] = await this.repository.findManyAndCount({ pageOptionsDto /*, where: { userId } */ });
    const data = snaps.map((snap) => plainToInstance(SnapResponseDto, snap));
    const meta = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, meta);
  }
}
