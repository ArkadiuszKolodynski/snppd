import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapRepository } from '../../repositories/snap.repository';
import { UpdateSnapCommand } from '../impl/update-snap.command';

@CommandHandler(UpdateSnapCommand)
export class UpdateSnapHandler implements ICommandHandler<UpdateSnapCommand> {
  constructor(private readonly repository: SnapRepository, private readonly eventBus: EventBus) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute({ id, updateSnapDto, userId }: UpdateSnapCommand): Promise<void> {
    // TODO: check if snap exist and if user owns snap
    // const updatedSnap = await this.repository.update(id, updateSnapDto);
    // this.eventBus.publish(new SnapUpdatedEvent(updatedSnap));
  }
}
