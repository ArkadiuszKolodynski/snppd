import { InjectQueue } from '@nestjs/bull';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Queue } from 'bull';
import { GENERATE_SNAP, SNAP_QUEUE_NAME } from '../../constants';
import { GenerateSnapCommand } from '../impl/generate-snap.command';

@CommandHandler(GenerateSnapCommand)
export class GenerateSnapHandler implements ICommandHandler<GenerateSnapCommand> {
  constructor(@InjectQueue(SNAP_QUEUE_NAME) private readonly snapQueue: Queue<{ url: string }>) {}

  async execute({ url }: GenerateSnapCommand): Promise<void> {
    this.snapQueue.add(GENERATE_SNAP, { url });
  }
}
