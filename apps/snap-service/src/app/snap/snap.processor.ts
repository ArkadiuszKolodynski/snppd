import { faker } from '@faker-js/faker';
import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { GenerateSnapJobPayload } from '@snppd/common';
import { SnapGeneratedEvent } from '@snppd/events';
import { Job } from 'bull';
import { GENERATE_SNAP, SNAP_QUEUE_NAME } from '../constants';
import { Snapper } from './snapper.class';

@Processor(SNAP_QUEUE_NAME)
export class SnapProcessor {
  private readonly logger = new Logger(SnapProcessor.name);

  constructor(private readonly eventBus: EventBus, private readonly snapper: Snapper) {}

  @Process(GENERATE_SNAP)
  async generateSnap(job: Job<GenerateSnapJobPayload>): Promise<void> {
    this.logger.debug('Generating new snap...');
    this.logger.debug(job.data);
    const { name, url } = job.data;
    // TODO: pass imageBuffer to storage service and return public url
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageBuffer, htmlContent, textContent, title } = await this.snapper.generateSnap(url);
    this.logger.debug('Generating snap completed!');
    // TODO: replace imageUrl with url from storage service
    this.eventBus.publish(
      new SnapGeneratedEvent({ name, url, title, imageUrl: faker.internet.url(), htmlContent, textContent })
    );
  }

  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error): void {
    this.logger.error(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)} failed with error: ${error}`
    );
  }
}
