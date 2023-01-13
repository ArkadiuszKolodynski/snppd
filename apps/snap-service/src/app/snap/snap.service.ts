import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteSnapCommand } from './commands/impl/delete-snap.command';
import { EnqueueSnapGenerationCommand } from './commands/impl/enqueue-snap-generation.command';
import { ScheduleSnapsPruneCommand } from './commands/impl/schedule-snaps-prune.command';
import { UpdateSnapCommand } from './commands/impl/update-snap.command';
import { GenerateSnapDto } from './dto';
import { UpdateSnapDto } from './dto/update-snap.dto';

@Injectable()
export class SnapService implements OnApplicationBootstrap {
  constructor(private readonly commandBus: CommandBus) {}

  onApplicationBootstrap(): Promise<void> {
    return this.commandBus.execute(new ScheduleSnapsPruneCommand());
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
