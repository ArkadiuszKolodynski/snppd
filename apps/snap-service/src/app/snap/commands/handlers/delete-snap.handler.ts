import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapRepository } from '../../repositories/snap.repository';
import { DeleteSnapCommand } from '../impl/delete-snap.command';

@CommandHandler(DeleteSnapCommand)
export class DeleteSnapHandler implements ICommandHandler<DeleteSnapCommand> {
  constructor(private readonly repository: SnapRepository, private readonly eventBus: EventBus) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute({ id, userId }: DeleteSnapCommand): Promise<void> {
    // TODO: check if snap exist and if user owns snap
    // await this.repository.remove(id);
    // this.eventBus.publish(new SnapDeletedEvent(id));
  }
}
