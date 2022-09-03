import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { GENERATE_SNAP, SNAP_QUEUE_NAME } from './constants';

@Processor(SNAP_QUEUE_NAME)
export class SnapProcessor {
  private readonly logger = new Logger(SnapProcessor.name);

  @Process(GENERATE_SNAP)
  handleGenerateSnap(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}
