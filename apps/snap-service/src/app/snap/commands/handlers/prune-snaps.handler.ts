import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapsPrunedEvent } from '@snppd/events';
import { SnapRepository } from '../../repositories/snap.repository';
import { PruneSnapsCommand } from '../impl/prune-snaps.command';

@CommandHandler(PruneSnapsCommand)
export class PruneSnapsHandler implements ICommandHandler<PruneSnapsCommand> {
  constructor(private readonly repository: SnapRepository, private readonly eventBus: EventBus) {}

  async execute(): Promise<void> {
    const prunedSnaps = await this.repository.prune();
    this.eventBus.publish(new SnapsPrunedEvent(prunedSnaps.map((snap) => snap.id)));
  }
}
