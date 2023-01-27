import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PageDto, PageOptionsDto } from '@snppd/shared';
import { DeleteSnapCommand } from './commands/impl/delete-snap.command';
import { EnqueueSnapGenerationCommand } from './commands/impl/enqueue-snap-generation.command';
import { ScheduleSnapsPruneCommand } from './commands/impl/schedule-snaps-prune.command';
import { UpdateSnapCommand } from './commands/impl/update-snap.command';
import { GenerateSnapDto, SnapResponseDto, UpdateSnapDto } from './dto';
import { FindSnapByIdQuery } from './queries/impl/find-snap-by-id.command';
import { FindSnapsQuery } from './queries/impl/find-snaps.command';

@Injectable()
export class SnapService implements OnApplicationBootstrap {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  onApplicationBootstrap(): Promise<void> {
    return this.commandBus.execute(new ScheduleSnapsPruneCommand());
  }

  findMany(pageOptionsDto: PageOptionsDto, userId: string): Promise<PageDto<SnapResponseDto>> {
    return this.queryBus.execute(new FindSnapsQuery(pageOptionsDto, userId));
  }

  findById(id: string, userId: string): Promise<SnapResponseDto> {
    return this.queryBus.execute(new FindSnapByIdQuery(id, userId));
  }

  generate(generateSnapDto: GenerateSnapDto, userId: string): Promise<void> {
    return this.commandBus.execute(new EnqueueSnapGenerationCommand(generateSnapDto, userId));
  }

  update(id: string, updateSnapDto: UpdateSnapDto, userId: string): Promise<void> {
    return this.commandBus.execute(new UpdateSnapCommand(id, updateSnapDto, userId));
  }

  delete(id: string, userId: string): Promise<void> {
    return this.commandBus.execute(new DeleteSnapCommand(id, userId));
  }
}
