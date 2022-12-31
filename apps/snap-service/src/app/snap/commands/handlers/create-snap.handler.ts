import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapCreatedEvent } from '@snppd/events';
import { SnapDao } from '../../dao/snap.dao';
import { CreateSnapCommand } from '../impl/create-snap.command';

@CommandHandler(CreateSnapCommand)
export class CreateSnapHandler implements ICommandHandler<CreateSnapCommand> {
  constructor(private readonly snapDao: SnapDao, private readonly eventBus: EventBus) {}

  async execute({ generatedSnap }: CreateSnapCommand): Promise<void> {
    const createdSnap = await this.snapDao.create(generatedSnap);
    this.eventBus.publish(new SnapCreatedEvent(createdSnap));
  }
}
