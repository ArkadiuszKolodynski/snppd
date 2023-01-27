import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ScheduleSnapsPruneCommand } from './commands/impl/schedule-snaps-prune.command';

@Injectable()
export class SnapService implements OnApplicationBootstrap {
  constructor(private readonly commandBus: CommandBus) {}

  onApplicationBootstrap(): Promise<void> {
    return this.commandBus.execute(new ScheduleSnapsPruneCommand());
  }
}
