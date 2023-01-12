import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapFailedEvent, SnapGeneratedEvent } from '@snppd/events';
import { SnapExecutor } from '../../executors';
import { GenerateSnapCommand } from '../impl/generate-snap.command';

@CommandHandler(GenerateSnapCommand)
export class GenerateSnapHandler implements ICommandHandler<GenerateSnapCommand> {
  // TODO: provide custom logger
  private readonly logger = new Logger(GenerateSnapHandler.name);

  constructor(@Inject(SnapExecutor) private readonly snapExecutor: SnapExecutor, private readonly eventBus: EventBus) {}

  async execute({ generateSnapDto, userId }: GenerateSnapCommand): Promise<void> {
    const { tags, url } = generateSnapDto;
    const generatedSnap = await this.snapExecutor.generateSnap(url);
    if (generatedSnap) {
      this.logger.debug('Generating snap completed!');
      this.eventBus.publish(new SnapGeneratedEvent({ ...generatedSnap, tags, url, userId }));
    } else {
      this.logger.debug('Generating snap failed!');
      this.eventBus.publish(new SnapFailedEvent({ url, userId }));
    }
  }
}
