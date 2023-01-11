import { faker } from '@faker-js/faker';
import { getQueueToken } from '@nestjs/bull';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SnapEnqueuedEvent } from '@snppd/events';
import { Queue } from 'bull';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { GENERATE_SNAP_JOB, SNAP_QUEUE_NAME } from '../../../../src/app/constants';
import { EnqueueSnapGenerationHandler } from '../../../../src/app/snap/commands/handlers/enqueue-snap-generation.handler';
import { GenerateSnapDto } from '../../../../src/app/snap/dto';

const EnqueueSnapGenerationCommandHandlerUnitSuite = suite<{
  eventBus: EventBus;
  handler: EnqueueSnapGenerationHandler;
  queue: Queue<{ generateSnapDto: GenerateSnapDto; userId: string }>;
}>('EnqueueSnapGenerationHandler - unit');

EnqueueSnapGenerationCommandHandlerUnitSuite.before(async (context) => {
  const queueToken = getQueueToken(SNAP_QUEUE_NAME);
  const module = await Test.createTestingModule({
    providers: [EnqueueSnapGenerationHandler, { provide: queueToken, useValue: { add: () => null } }, EventBus],
  })
    .overrideProvider(EventBus)
    .useValue({ publish: () => null })
    .compile();

  context.eventBus = module.get(EventBus);
  context.handler = module.get(EnqueueSnapGenerationHandler);
  context.queue = module.get(queueToken);
});

EnqueueSnapGenerationCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

EnqueueSnapGenerationCommandHandlerUnitSuite('should call Queue.add method', async ({ handler, queue }) => {
  const spy = sinon.spy(queue, 'add');
  const url = faker.internet.url();
  const tags = [faker.random.word(), faker.random.word()];
  const userId = faker.datatype.uuid();

  await handler.execute({ generateSnapDto: { tags, url }, userId });

  expect(spy.calledOnceWithExactly(GENERATE_SNAP_JOB, { generateSnapDto: { url, tags }, userId })).to.be.true;
});

EnqueueSnapGenerationCommandHandlerUnitSuite('should publish SnapEnqueuedEvent', async ({ handler, eventBus }) => {
  const spy = sinon.spy(eventBus, 'publish');
  const url = faker.internet.url();
  const tags = [faker.random.word(), faker.random.word()];
  const userId = faker.datatype.uuid();

  await handler.execute({ generateSnapDto: { tags, url }, userId });

  expect(spy.calledOnceWithExactly(new SnapEnqueuedEvent(url, userId))).to.be.true;
});

EnqueueSnapGenerationCommandHandlerUnitSuite.run();
