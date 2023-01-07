import { faker } from '@faker-js/faker';
import { getQueueToken } from '@nestjs/bull';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Queue } from 'bull';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { GENERATE_SNAP_JOB, SNAP_QUEUE_NAME } from '../../../../src/app/constants';
import { EnqueueSnapGenerationHandler } from '../../../../src/app/snap/commands/handlers/enqueue-snap-generation.handler';
import { GenerateSnapDto } from '../../../../src/app/snap/dto';

const enqueueSnapGenerationCommandHandlerUnitSuite = suite<{
  app: INestApplication;
  handler: EnqueueSnapGenerationHandler;
  queue: Queue<GenerateSnapDto>;
}>('Generate Snap Command Handler - unit');

enqueueSnapGenerationCommandHandlerUnitSuite.before(async (context) => {
  const queueToken = getQueueToken(SNAP_QUEUE_NAME);
  const module = await Test.createTestingModule({
    providers: [EnqueueSnapGenerationHandler, { provide: queueToken, useValue: { add: () => null } }],
  }).compile();

  context.handler = module.get(EnqueueSnapGenerationHandler);
  context.queue = module.get(queueToken);
});

enqueueSnapGenerationCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

enqueueSnapGenerationCommandHandlerUnitSuite('should call Queue.add method', async ({ handler, queue }) => {
  const spy = sinon.spy(queue, 'add');
  const url = faker.internet.url();
  const tags = [faker.random.word(), faker.random.word()];
  const userId = faker.datatype.uuid();

  await handler.execute({ generateSnapDto: { tags, url }, userId });

  expect(spy.calledOnceWithExactly(GENERATE_SNAP_JOB, { url, tags })).to.be.true;
});

enqueueSnapGenerationCommandHandlerUnitSuite.run();
