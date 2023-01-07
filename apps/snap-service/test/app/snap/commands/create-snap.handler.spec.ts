import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { Snap } from '@prisma/client';
import { GeneratedSnap } from '@snppd/common';
import { SnapCreatedEvent } from '@snppd/events';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { CreateSnapHandler } from '../../../../src/app/snap/commands/handlers/create-snap.handler';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';

const createSnapCommandHandlerUnitSuite = suite<{
  app: INestApplication;
  createdSnap: Snap;
  dao: SnapDao;
  eventBus: EventBus;
  generatedSnap: GeneratedSnap;
  handler: CreateSnapHandler;
}>('Create Snap Command Handler - unit');

createSnapCommandHandlerUnitSuite.before(async (context) => {
  const generatedSnap: GeneratedSnap = {
    author: faker.name.fullName(),
    content: faker.lorem.paragraph(),
    excerpt: faker.lorem.sentences(),
    htmlContent: faker.lorem.paragraph(),
    lang: faker.random.locale(),
    length: faker.datatype.number(),
    screenshotUrl: faker.image.imageUrl(),
    snapImageUrl: faker.image.imageUrl(),
    tags: [faker.word.noun(), faker.word.noun()],
    textContent: faker.lorem.paragraph(),
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    userId: faker.datatype.uuid(),
  };

  const createdSnap: Snap = {
    ...generatedSnap,
    id: faker.datatype.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
  };

  const module = await Test.createTestingModule({
    providers: [CreateSnapHandler, EventBus, SnapDao],
  })
    .overrideProvider(EventBus)
    .useValue({ publish: () => null })
    .overrideProvider(SnapDao)
    .useValue({
      create: () => createdSnap,
    })
    .compile();

  context.createdSnap = createdSnap;
  context.dao = module.get(SnapDao);
  context.eventBus = module.get(EventBus);
  context.generatedSnap = generatedSnap;
  context.handler = module.get(CreateSnapHandler);
});

createSnapCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

createSnapCommandHandlerUnitSuite(
  'should call SnapDao.create method and publish event',
  async ({ createdSnap, dao, eventBus, generatedSnap, handler }) => {
    const spyDao = sinon.spy(dao, 'create');
    const spyEventBus = sinon.spy(eventBus, 'publish');

    await handler.execute({ generatedSnap });

    expect(spyDao.calledOnceWithExactly(generatedSnap)).to.be.true;
    expect(spyEventBus.calledOnceWithExactly(new SnapCreatedEvent(createdSnap))).to.be.true;
  }
);

createSnapCommandHandlerUnitSuite.run();
