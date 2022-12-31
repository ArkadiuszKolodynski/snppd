import { InjectQueue } from '@nestjs/bull';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapEnqueuedEvent } from '@snppd/events';
import { Queue } from 'bull';
import { GENERATE_SNAP_JOB, SNAP_QUEUE_NAME } from '../../../constants';
import { GenerateSnapDto } from '../../dto';
import { EnqueueSnapGenerationCommand } from '../impl/enqueue-snap-generation.command';

@CommandHandler(EnqueueSnapGenerationCommand)
export class EnqueueSnapGenerationHandler implements ICommandHandler<EnqueueSnapGenerationCommand> {
  constructor(
    @InjectQueue(SNAP_QUEUE_NAME) private readonly snapQueue: Queue<GenerateSnapDto>,
    private readonly eventBus: EventBus
  ) {}

  async execute({ generateSnapDto }: EnqueueSnapGenerationCommand): Promise<void> {
    await this.snapQueue.add(GENERATE_SNAP_JOB, generateSnapDto);
    this.eventBus.publish(new SnapEnqueuedEvent(generateSnapDto.url));
  }
}
