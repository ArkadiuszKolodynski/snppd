import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { GenerateSnapJobPayload } from '@snppd/common';
import { SnapFailureEvent, SnapGeneratedEvent } from '@snppd/events';
import { Job } from 'bull';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { SnapExecutor } from '../../../src/app/snap/executors';
import { SnapProcessor } from '../../../src/app/snap/snap.processor';

const generateSnapUnitSuite = suite<{
  app: INestApplication;
  eventBus: EventBus;
  processor: SnapProcessor;
  snapExecutor: SnapExecutor;
}>('Generate Snap - unit');

generateSnapUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [
      SnapProcessor,
      { provide: EventBus, useValue: { publish: () => null } },
      {
        provide: SnapExecutor,
        useValue: {
          generateSnap: () => ({
            imageBuffer: Buffer.from(faker.datatype.string(), 'utf-8'),
            title: faker.lorem.words(3),
            htmlContent: faker.lorem.paragraphs(2),
            textContent: faker.lorem.paragraphs(2),
          }),
        },
      },
    ],
  }).compile();

  context.eventBus = module.get(EventBus);
  context.processor = module.get(SnapProcessor);
  context.snapExecutor = module.get(SnapExecutor);
});

generateSnapUnitSuite.after.each(() => {
  sinon.restore();
});

generateSnapUnitSuite('should log job info on active', async ({ processor }) => {
  const loggerStub = sinon.stub(processor['logger'], 'log');
  const name = faker.lorem.words(3);
  const url = faker.internet.url();
  const job = { data: { name, url } } as Job<GenerateSnapJobPayload>;

  processor.onActive(job);

  expect(loggerStub.calledOnceWith(sinon.match(job.data.name))).to.be.true;
});

generateSnapUnitSuite('should log error on failed', async ({ processor }) => {
  const loggerStub = sinon.stub(processor['logger'], 'error');
  const name = faker.lorem.words(3);
  const url = faker.internet.url();
  const job = { data: { name, url } } as Job<GenerateSnapJobPayload>;

  processor.onFailed(job, new Error('Something went wrong'));

  expect(loggerStub.calledOnceWith(sinon.match(job.data.name))).to.be.true;
});

generateSnapUnitSuite('should call Snapper.generateSnap method', async ({ processor, snapExecutor: snapper }) => {
  const spy = sinon.spy(snapper, 'generateSnap');
  const name = faker.lorem.words(3);
  const url = faker.internet.url();
  const job = { data: { name, url } } as Job<GenerateSnapJobPayload>;

  await processor.generateSnap(job);

  expect(spy.calledOnceWithExactly(url)).to.be.true;
});

generateSnapUnitSuite(
  'should call EventBus.publish method with SnapGeneratedEvent if snap was generated successfully',
  async ({ processor, eventBus }) => {
    const spy = sinon.spy(eventBus, 'publish');
    const name = faker.lorem.words(3);
    const url = faker.internet.url();
    const job = { data: { name, url } } as Job<GenerateSnapJobPayload>;

    await processor.generateSnap(job);

    expect(spy.calledOnceWith(sinon.match.instanceOf(SnapGeneratedEvent))).to.be.true;
  }
);

generateSnapUnitSuite(
  'should call EventBus.publish method with SnapFailureEvent if snap was not generated',
  async ({ processor, eventBus, snapExecutor }) => {
    sinon.stub(snapExecutor, 'generateSnap').resolves(null);
    const spy = sinon.spy(eventBus, 'publish');
    const name = faker.lorem.words(3);
    const url = faker.internet.url();
    const job = { data: { name, url } } as Job<GenerateSnapJobPayload>;

    await processor.generateSnap(job);

    expect(spy.calledOnceWith(sinon.match.instanceOf(SnapFailureEvent))).to.be.true;
  }
);

generateSnapUnitSuite.run();
