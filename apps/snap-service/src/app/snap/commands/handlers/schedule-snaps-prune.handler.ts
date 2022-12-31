import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Queue } from 'bull';
import { PRUNE_SNAPS_JOB, SNAP_QUEUE_NAME } from '../../../constants';
import { ScheduleSnapsPruneCommand } from '../impl/schedule-snaps-prune.command';

@CommandHandler(ScheduleSnapsPruneCommand)
export class ScheduleSnapsPruneHandler implements ICommandHandler<ScheduleSnapsPruneCommand> {
  private readonly CRON: string;
  private readonly JOB_ID: string;

  constructor(
    @InjectQueue(SNAP_QUEUE_NAME) private readonly snapQueue: Queue<null>,
    private readonly configService: ConfigService
  ) {
    this.CRON = this.configService.get('PRUNE_SNAPS_CRON') || '* * * * *';
    this.JOB_ID = PRUNE_SNAPS_JOB;
  }

  async execute(): Promise<void> {
    const allRepeatableJobs = await this.snapQueue.getRepeatableJobs();
    const pruneSnapsJob = allRepeatableJobs.filter((job) => job.id === this.JOB_ID).pop();
    if (pruneSnapsJob && pruneSnapsJob.cron !== this.CRON) {
      await this.snapQueue.removeRepeatableByKey(pruneSnapsJob.key);
    }
    await this.snapQueue.add(PRUNE_SNAPS_JOB, null, {
      jobId: this.JOB_ID,
      repeat: { cron: this.CRON },
    });
  }
}
