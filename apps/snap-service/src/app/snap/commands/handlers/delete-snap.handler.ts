import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Snap } from '@prisma/client';
import { SnapDao } from '../../dao/snap.dao';
import { DeleteSnapCommand } from '../impl/delete-snap.command';

@CommandHandler(DeleteSnapCommand)
export class DeleteSnapHandler implements ICommandHandler<DeleteSnapCommand> {
  constructor(private readonly snapDao: SnapDao) {}

  async execute({ id }: DeleteSnapCommand): Promise<Snap> {
    // TODO: check if user owns snap
    return this.snapDao.delete(id);
  }
}
