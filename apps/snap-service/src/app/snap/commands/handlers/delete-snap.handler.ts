import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapDeletedEvent } from '@snppd/events';
import { SnapDao } from '../../dao/snap.dao';
import { DeleteSnapCommand } from '../impl/delete-snap.command';

@CommandHandler(DeleteSnapCommand)
export class DeleteSnapHandler implements ICommandHandler<DeleteSnapCommand> {
  constructor(private readonly snapDao: SnapDao, private readonly eventBus: EventBus) {}

  async execute({ id }: DeleteSnapCommand): Promise<void> {
    // TODO: check if snap exist and if user owns snap
    const asdf = await this.snapDao.delete(id);
    console.log(asdf);
    this.eventBus.publish(new SnapDeletedEvent(id));
  }
}
