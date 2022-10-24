import { faker } from '@faker-js/faker';
import { getQueueToken } from '@nestjs/bull';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GenerateSnapJobPayload } from '@snppd/common';
import { Queue } from 'bull';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { GENERATE_SNAP, SNAP_QUEUE_NAME } from '../../../../src/app/constants';
import { GenerateSnapHandler } from '../../../../src/app/snap/commands/handlers/generate-snap.handler';

const generateSnapCommandHandlerUnitSuite = suite<{
  app: INestApplication;
  handler: GenerateSnapHandler;
  queue: Queue<GenerateSnapJobPayload>;
}>('Generate Snap Command Handler - unit');

generateSnapCommandHandlerUnitSuite.before(async (context) => {
  const queueToken = getQueueToken(SNAP_QUEUE_NAME);
  const module = await Test.createTestingModule({
    providers: [GenerateSnapHandler, { provide: queueToken, useValue: { add: () => null } }],
  }).compile();

  context.handler = module.get(GenerateSnapHandler);
  context.queue = module.get(queueToken);
});

generateSnapCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

generateSnapCommandHandlerUnitSuite('should call Queue.add method', async ({ handler, queue }) => {
  const spy = sinon.spy(queue, 'add');
  const name = faker.random.words(3);
  const url = faker.internet.url();

  await handler.execute({ name, url });

  expect(spy.calledOnceWithExactly(GENERATE_SNAP, { name, url })).to.be.true;
});

generateSnapCommandHandlerUnitSuite.run();
