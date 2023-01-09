import { faker } from '@faker-js/faker';
import { getQueueToken } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { Queue } from 'bull';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { PRUNE_SNAPS_JOB, SNAP_QUEUE_NAME } from '../../../../src/app/constants';
import { ScheduleSnapsPruneHandler } from '../../../../src/app/snap/commands/handlers/schedule-snaps-prune.handler';

const ScheduleSnapsPruneCommandHandlerUnitSuite = suite<{
  cron: string;
  eventBus: EventBus;
  handler: ScheduleSnapsPruneHandler;
  queue: Queue<null>;
}>('ScheduleSnapsPruneHandler - unit');

ScheduleSnapsPruneCommandHandlerUnitSuite.before(async (context) => {
  const cron = '6 2 * * *';
  const queueToken = getQueueToken(SNAP_QUEUE_NAME);
  const module = await Test.createTestingModule({
    providers: [
      ScheduleSnapsPruneHandler,
      ConfigService,
      EventBus,
      {
        provide: queueToken,
        useValue: { add: () => null, getRepeatableJobs: () => [], removeRepeatableByKey: () => null },
      },
    ],
  })
    .overrideProvider(EventBus)
    .useValue({ publish: () => null })
    .overrideProvider(ConfigService)
    .useValue({ get: () => cron })
    .compile();

  context.cron = cron;
  context.eventBus = module.get(EventBus);
  context.handler = module.get(ScheduleSnapsPruneHandler);
  context.queue = module.get(queueToken);
});

ScheduleSnapsPruneCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

ScheduleSnapsPruneCommandHandlerUnitSuite(
  'should call Queue.add method if there are no repeatable jobs',
  async ({ cron, handler, queue }) => {
    sinon.stub(queue, 'getRepeatableJobs').resolves([]);
    const spy = sinon.spy(queue, 'add');

    await handler.execute();

    expect(spy.calledOnceWithExactly(PRUNE_SNAPS_JOB, null, { jobId: PRUNE_SNAPS_JOB, repeat: { cron } })).to.be.true;
  }
);

ScheduleSnapsPruneCommandHandlerUnitSuite(
  'should call Queue.add method if there are no repeatable jobs with fixed id',
  async ({ cron, handler, queue }) => {
    sinon
      .stub(queue, 'getRepeatableJobs')
      .resolves([{ id: 'not-a-fixed-id', cron: '', every: 1, key: '', name: '', next: 1 }]);
    const spy = sinon.spy(queue, 'add');

    await handler.execute();

    expect(spy.calledOnceWithExactly(PRUNE_SNAPS_JOB, null, { jobId: PRUNE_SNAPS_JOB, repeat: { cron } })).to.be.true;
  }
);

ScheduleSnapsPruneCommandHandlerUnitSuite(
  'should delete existing repeatable job and call Queue.add method if there is repeatable jobs with fixed id',
  async ({ cron, handler, queue }) => {
    const key = faker.random.word();
    sinon
      .stub(queue, 'getRepeatableJobs')
      .resolves([{ id: PRUNE_SNAPS_JOB, cron: '1 1 1 1 1', every: 1, key, name: '', next: 1 }]);
    const removeJobSpy = sinon.spy(queue, 'removeRepeatableByKey');
    const spy = sinon.spy(queue, 'add');

    await handler.execute();

    expect(removeJobSpy.calledWithExactly(key)).to.be.true;
    expect(spy.calledOnceWithExactly(PRUNE_SNAPS_JOB, null, { jobId: PRUNE_SNAPS_JOB, repeat: { cron } })).to.be.true;
  }
);

ScheduleSnapsPruneCommandHandlerUnitSuite.run();
