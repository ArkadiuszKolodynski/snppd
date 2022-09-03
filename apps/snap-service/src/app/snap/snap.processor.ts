import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { SnapGeneratedEvent } from '@snppd/events';
import { Job } from 'bull';
import * as puppeteer from 'puppeteer';
import { GENERATE_SNAP, SNAP_QUEUE_NAME } from './constants';

@Processor(SNAP_QUEUE_NAME)
export class SnapProcessor {
  private readonly logger = new Logger(SnapProcessor.name);

  constructor(private readonly eventBus: EventBus) {}

  @Process(GENERATE_SNAP)
  async generateSnap(job: Job<{ url: string }>): Promise<void> {
    this.logger.debug('Start generating snap...');
    this.logger.debug(job.data);
    const { url } = job.data;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: 'dist/example.png', fullPage: true });
    const title = await page.title();
    const content = await page.content();
    await browser.close();
    this.eventBus.publish(new SnapGeneratedEvent(title, 'url', content));
    this.logger.debug('Snap generating completed');
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
