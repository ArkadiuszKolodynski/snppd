import { InjectQueue } from '@nestjs/bull';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Snap } from '@prisma/client';
import { Queue } from 'bull';
import { SNAP_QUEUE_NAME } from '../../constants';
import { GenerateSnapCommand } from '../impl/generate-snap.command';

@CommandHandler(GenerateSnapCommand)
export class GenerateSnapHandler implements ICommandHandler<GenerateSnapCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectQueue(SNAP_QUEUE_NAME) private readonly snapQueue: Queue
  ) {}

  async execute({ url }: GenerateSnapCommand): Promise<Snap> {
    return null;
  }
}
