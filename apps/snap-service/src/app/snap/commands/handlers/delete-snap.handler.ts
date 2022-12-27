import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SnapDao } from '../../dao/snap.dao';
import { DeleteSnapCommand } from '../impl/delete-snap.command';

@CommandHandler(DeleteSnapCommand)
export class DeleteSnapHandler implements ICommandHandler<DeleteSnapCommand> {
  constructor(private readonly snapDao: SnapDao) {}

  async execute({ id }: DeleteSnapCommand): Promise<void> {
    // TODO: check if user owns snap
    await this.snapDao.delete(id);
  }
}
