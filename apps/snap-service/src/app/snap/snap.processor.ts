import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@snppd/logger';
import { Job } from 'bullmq';

import { GENERATE_SNAP_JOB, PRUNE_SNAPS_JOB, SNAP_QUEUE_NAME } from '../constants';
import { GenerateSnapCommand } from './commands/impl/generate-snap.command';
import { PruneSnapsCommand } from './commands/impl/prune-snaps.command';

@Processor(SNAP_QUEUE_NAME)
export class SnapProcessor extends WorkerHost {
  constructor(private readonly commandBus: CommandBus, private readonly logger: Logger) {
    super();
    this.logger.setContext(SnapProcessor.name);
  }

  // TODO: split to separate queues
  async process(job: Job): Promise<void> {
    switch (job.name) {
      case GENERATE_SNAP_JOB: {
        this.logger.info('Generating snap...');
        return await this.commandBus.execute(new GenerateSnapCommand(job.data.generateSnapDto, job.data.userId));
      }
      case PRUNE_SNAPS_JOB: {
        this.logger.info('Pruning snaps...');
        return await this.commandBus.execute(new PruneSnapsCommand());
      }
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job): void {
    this.logger.info(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error): void {
    this.logger.error(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data
      )} failed with error: ${JSON.stringify(error)}`
    );
  }
}
