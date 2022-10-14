import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { GenerateSnapJobPayload } from '@snppd/common';
import { SnapGeneratedEvent } from '@snppd/events';
import { Job } from 'bull';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { SnapProcessor } from '../../../src/app/snap/snap.processor';
import { Snapper } from '../../../src/app/snap/snapper.class';

const generateSnapUnitSuite = suite<{
  app: INestApplication;
  eventBus: EventBus;
  processor: SnapProcessor;
  snapper: Snapper;
}>('Generate Snap - unit');

generateSnapUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [
      SnapProcessor,
      { provide: EventBus, useValue: { publish: () => null } },
      {
        provide: Snapper,
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
  context.snapper = module.get(Snapper);
});

generateSnapUnitSuite.after.each(() => {
  sinon.restore();
});

generateSnapUnitSuite('should call Snapper.generateSnap method', async ({ processor, snapper }) => {
  const spy = sinon.spy(snapper, 'generateSnap');
  const url = faker.internet.url();
  const job = { data: { name: faker.lorem.words(3), url } } as Job<GenerateSnapJobPayload>;

  await processor.generateSnap(job);

  expect(spy.calledOnceWithExactly(url)).to.be.true;
});

generateSnapUnitSuite('should not trigger the event if snapper throws', async ({ processor, eventBus, snapper }) => {
  const spy = sinon.spy(eventBus, 'publish');
  sinon.stub(snapper, 'generateSnap').throws(new Error('asdf'));
  const url = faker.internet.url();
  const job = { data: { name: faker.lorem.words(3), url } } as Job<GenerateSnapJobPayload>;

  expect(processor.generateSnap(job)).to.throw();
  expect(spy.notCalled).to.be.true;
});

generateSnapUnitSuite('should call EventBus.publish method', async ({ processor, eventBus }) => {
  const spy = sinon.spy(eventBus, 'publish');
  const job = { data: { name: faker.lorem.words(3), url: faker.internet.url() } } as Job<GenerateSnapJobPayload>;

  await processor.generateSnap(job);

  expect(spy.calledOnceWith(sinon.match.instanceOf(SnapGeneratedEvent))).to.be.true;
});

generateSnapUnitSuite.run();
