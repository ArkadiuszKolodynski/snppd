import { InjectQueue } from '@nestjs/bull';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Queue } from 'bull';
import { GENERATE_SNAP, SNAP_QUEUE_NAME } from '../../../constants';
import { GenerateSnapCommand } from '../impl/generate-snap.command';

@CommandHandler(GenerateSnapCommand)
export class GenerateSnapHandler implements ICommandHandler<GenerateSnapCommand> {
  constructor(@InjectQueue(SNAP_QUEUE_NAME) private readonly snapQueue: Queue<{ name: string; url: string }>) {}

  async execute({ name, url }: GenerateSnapCommand): Promise<void> {
    await this.snapQueue.add(GENERATE_SNAP, { name, url });
  }
}
