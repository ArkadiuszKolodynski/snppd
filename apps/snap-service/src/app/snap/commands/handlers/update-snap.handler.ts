import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapUpdatedEvent } from '@snppd/events';
import { SnapDao } from '../../dao/snap.dao';
import { UpdateSnapCommand } from '../impl/update-snap.command';

@CommandHandler(UpdateSnapCommand)
export class UpdateSnapHandler implements ICommandHandler<UpdateSnapCommand> {
  constructor(private readonly snapDao: SnapDao, private readonly eventBus: EventBus) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute({ id, updateSnapDto, userId }: UpdateSnapCommand): Promise<void> {
    // TODO: check if snap exist and if user owns snap
    const updatedSnap = await this.snapDao.update(id, updateSnapDto);
    this.eventBus.publish(new SnapUpdatedEvent(updatedSnap));
  }
}
