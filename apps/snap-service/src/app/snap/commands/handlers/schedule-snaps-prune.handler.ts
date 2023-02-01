import { InjectQueue } from '@nestjs/bull';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Queue } from 'bull';
import { ConfigService } from '../../../config/config.service';
import { PRUNE_SNAPS_JOB, SNAP_QUEUE_NAME } from '../../../constants';
import { ScheduleSnapsPruneCommand } from '../impl/schedule-snaps-prune.command';

@CommandHandler(ScheduleSnapsPruneCommand)
export class ScheduleSnapsPruneHandler implements ICommandHandler<ScheduleSnapsPruneCommand> {
  constructor(
    @InjectQueue(SNAP_QUEUE_NAME) private readonly snapQueue: Queue<null>,
    private readonly configService: ConfigService
  ) {}

  async execute(): Promise<void> {
    const allRepeatableJobs = await this.snapQueue.getRepeatableJobs();
    const pruneSnapsJob = allRepeatableJobs.filter((job) => job.id === PRUNE_SNAPS_JOB).pop();
    if (pruneSnapsJob && pruneSnapsJob.cron !== this.configService.pruneSnapsCron) {
      await this.snapQueue.removeRepeatableByKey(pruneSnapsJob.key);
    }
    await this.snapQueue.add(PRUNE_SNAPS_JOB, null, {
      jobId: PRUNE_SNAPS_JOB,
      repeat: { cron: this.configService.pruneSnapsCron },
    });
  }
}
