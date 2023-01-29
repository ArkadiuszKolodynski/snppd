import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapFailedEvent, SnapGeneratedEvent } from '@snppd/events';
import { Logger } from '@snppd/logger';
import { SnapExecutor } from '../../executors';
import { GenerateSnapCommand } from '../impl/generate-snap.command';

@CommandHandler(GenerateSnapCommand)
export class GenerateSnapHandler implements ICommandHandler<GenerateSnapCommand> {
  constructor(
    @Inject(SnapExecutor) private readonly snapExecutor: SnapExecutor,
    private readonly eventBus: EventBus,
    private readonly logger: Logger
  ) {
    this.logger.setContext(GenerateSnapHandler.name);
  }

  async execute({ generateSnapDto, userId }: GenerateSnapCommand): Promise<void> {
    const { tags, url } = generateSnapDto;
    const generatedSnap = await this.snapExecutor.generateSnap(url);
    if (generatedSnap) {
      this.logger.info('Generating snap completed!');
      this.eventBus.publish(new SnapGeneratedEvent({ ...generatedSnap, tags, url, userId }));
    } else {
      this.logger.info('Generating snap failed!');
      this.eventBus.publish(new SnapFailedEvent({ url, userId }));
    }
  }
}
