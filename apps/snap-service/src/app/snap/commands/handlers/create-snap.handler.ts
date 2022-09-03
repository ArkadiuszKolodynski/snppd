import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Snap } from '@prisma/client';
import { SnapDao } from '../../dao/snap.dao';
import { CreateSnapCommand } from '../impl/create-snap.command';

@CommandHandler(CreateSnapCommand)
export class CreateSnapHandler implements ICommandHandler<CreateSnapCommand> {
  constructor(private readonly snapDao: SnapDao) {}

  async execute({ payload }: CreateSnapCommand): Promise<Snap> {
    return this.snapDao.create({ ...payload });
  }
}
