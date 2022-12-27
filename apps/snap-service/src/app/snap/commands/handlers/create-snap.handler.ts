import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SnapDao } from '../../dao/snap.dao';
import { CreateSnapCommand } from '../impl/create-snap.command';

@CommandHandler(CreateSnapCommand)
export class CreateSnapHandler implements ICommandHandler<CreateSnapCommand> {
  constructor(private readonly snapDao: SnapDao) {}

  async execute({ generatedSnap }: CreateSnapCommand): Promise<void> {
    await this.snapDao.create(generatedSnap);
  }
}
