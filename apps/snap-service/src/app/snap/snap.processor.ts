import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@snppd/logger';
import { Job } from 'bull';
import { GENERATE_SNAP_JOB, PRUNE_SNAPS_JOB, SNAP_QUEUE_NAME } from '../constants';
import { GenerateSnapCommand } from './commands/impl/generate-snap.command';
import { PruneSnapsCommand } from './commands/impl/prune-snaps.command';
import { GenerateSnapDto } from './dto';

@Processor(SNAP_QUEUE_NAME)
export class SnapProcessor {
  constructor(private readonly commandBus: CommandBus, private readonly logger: Logger) {
    this.logger.setContext(SnapProcessor.name);
  }

  @Process(GENERATE_SNAP_JOB)
  async generateSnap(job: Job<{ generateSnapDto: GenerateSnapDto; userId: string }>): Promise<void> {
    this.logger.info('Generating snap...');
    await this.commandBus.execute(new GenerateSnapCommand(job.data.generateSnapDto, job.data.userId));
  }

  @Process(PRUNE_SNAPS_JOB)
  async pruneSnaps(): Promise<void> {
    this.logger.info('Pruning snaps...');
    await this.commandBus.execute(new PruneSnapsCommand());
  }

  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.info(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
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
