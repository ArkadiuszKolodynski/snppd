import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SnapDao } from '../../dao/snap.dao';
import { SoftDeleteSnapCommand } from '../impl/soft-delete-snap.command';

@CommandHandler(SoftDeleteSnapCommand)
export class SoftDeleteSnapHandler implements ICommandHandler<SoftDeleteSnapCommand> {
  constructor(private readonly snapDao: SnapDao) {}

  async execute({ id }: SoftDeleteSnapCommand): Promise<void> {
    // TODO: check if user owns snap
    await this.snapDao.softDelete(id);
  }
}
