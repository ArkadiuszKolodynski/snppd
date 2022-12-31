import { faker } from '@faker-js/faker';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapFailureEvent, SnapGeneratedEvent } from '@snppd/events';
import { SnapExecutor } from '../../executors';
import { GenerateSnapCommand } from '../impl/generate-snap.command';

@CommandHandler(GenerateSnapCommand)
export class GenerateSnapHandler implements ICommandHandler<GenerateSnapCommand> {
  // TODO: provide custom logger
  private readonly logger = new Logger(GenerateSnapHandler.name);

  constructor(@Inject(SnapExecutor) private readonly snapExecutor: SnapExecutor, private readonly eventBus: EventBus) {}

  async execute({ generateSnapDto }: GenerateSnapCommand): Promise<void> {
    const { name, tags, url } = generateSnapDto;
    const generatedSnap = await this.snapExecutor.generateSnap(url);
    if (generatedSnap) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { imageBuffer, htmlContent, textContent, title } = generatedSnap;
      this.logger.debug('Generating snap completed!');
      // TODO: replace imageUrl with url from storage service
      this.eventBus.publish(
        new SnapGeneratedEvent({ name, url, title, tags, imageUrl: faker.internet.url(), htmlContent, textContent })
      );
    } else {
      this.logger.debug('Generating snap failure!');
      this.eventBus.publish(new SnapFailureEvent({ name, url }));
    }
  }
}
