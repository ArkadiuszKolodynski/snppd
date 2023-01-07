import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapDeletedEvent } from '@snppd/events';
import { SnapDao } from '../../dao/snap.dao';
import { DeleteSnapCommand } from '../impl/delete-snap.command';

@CommandHandler(DeleteSnapCommand)
export class DeleteSnapHandler implements ICommandHandler<DeleteSnapCommand> {
  constructor(private readonly snapDao: SnapDao, private readonly eventBus: EventBus) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute({ id, userId }: DeleteSnapCommand): Promise<void> {
    // TODO: check if snap exist and if user owns snap
    await this.snapDao.delete(id);
    this.eventBus.publish(new SnapDeletedEvent(id));
  }
}
