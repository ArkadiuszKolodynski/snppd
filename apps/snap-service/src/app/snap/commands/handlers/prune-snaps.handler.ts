import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapsPrunedEvent } from '@snppd/events';
import { SnapDao } from '../../dao/snap.dao';
import { PruneSnapsCommand } from '../impl/prune-snaps.command';

@CommandHandler(PruneSnapsCommand)
export class PruneSnapsHandler implements ICommandHandler<PruneSnapsCommand> {
  constructor(private readonly snapDao: SnapDao, private readonly eventBus: EventBus) {}

  async execute(): Promise<void> {
    const prunedSnaps = await this.snapDao.prune();
    this.eventBus.publish(new SnapsPrunedEvent(prunedSnaps.map((snap) => snap.id)));
  }
}
