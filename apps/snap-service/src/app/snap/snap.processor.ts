import { faker } from '@faker-js/faker';
import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { GenerateSnapJobPayload } from '@snppd/common';
import { SnapFailureEvent, SnapGeneratedEvent } from '@snppd/events';
import { Job } from 'bull';
import { GENERATE_SNAP, SNAP_QUEUE_NAME } from '../constants';
import { SnapExecutor } from './executors';

@Processor(SNAP_QUEUE_NAME)
export class SnapProcessor {
  // TODO: provide custom logger
  private readonly logger = new Logger(SnapProcessor.name);

  constructor(private readonly eventBus: EventBus, @Inject(SnapExecutor) private readonly snapExecutor: SnapExecutor) {}

  @Process(GENERATE_SNAP)
  async generateSnap(job: Job<GenerateSnapJobPayload>): Promise<void> {
    this.logger.debug('Generating new snap...');
    this.logger.debug(job.data);
    const { name, url, tags } = job.data;
    // TODO: pass imageBuffer to storage service and return public url
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

  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error): void {
    this.logger.error(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data
      )} failed with error: ${JSON.stringify(error)}`
    );
  }
}
