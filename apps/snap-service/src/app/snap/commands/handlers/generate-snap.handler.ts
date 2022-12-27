import { InjectQueue } from '@nestjs/bull';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateSnapJobPayload } from '@snppd/common';
import { Queue } from 'bull';
import { GENERATE_SNAP_JOB, SNAP_QUEUE_NAME } from '../../../constants';
import { GenerateSnapCommand } from '../impl/generate-snap.command';

@CommandHandler(GenerateSnapCommand)
export class GenerateSnapHandler implements ICommandHandler<GenerateSnapCommand> {
  constructor(@InjectQueue(SNAP_QUEUE_NAME) private readonly snapQueue: Queue<GenerateSnapJobPayload>) {}

  async execute({ generateSnapDto }: GenerateSnapCommand): Promise<void> {
    await this.snapQueue.add(GENERATE_SNAP_JOB, generateSnapDto);
  }
}
