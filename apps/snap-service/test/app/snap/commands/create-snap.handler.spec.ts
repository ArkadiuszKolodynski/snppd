import { faker } from '@faker-js/faker';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { Snap } from '@prisma-snap/client';
import { SnapCreatedEvent } from '@snppd/events';
import { GeneratedSnap } from '@snppd/shared';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { CreateSnapHandler } from '../../../../src/app/snap/commands/handlers/create-snap.handler';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';

const CreateSnapCommandHandlerUnitSuite = suite<{
  createdSnap: Snap;
  dao: SnapDao;
  eventBus: EventBus;
  generatedSnap: GeneratedSnap;
  handler: CreateSnapHandler;
}>('CreateSnapHandler - unit');

CreateSnapCommandHandlerUnitSuite.before(async (context) => {
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

CreateSnapCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

CreateSnapCommandHandlerUnitSuite('should call SnapDao.create method', async ({ dao, generatedSnap, handler }) => {
  const spy = sinon.spy(dao, 'create');

  await handler.execute({ generatedSnap });

  expect(spy.calledOnceWithExactly(generatedSnap)).to.be.true;
});

CreateSnapCommandHandlerUnitSuite(
  'should publish SnapCreatedEvent',
  async ({ createdSnap, eventBus, generatedSnap, handler }) => {
    const spy = sinon.spy(eventBus, 'publish');

    await handler.execute({ generatedSnap });

    expect(spy.calledOnceWithExactly(new SnapCreatedEvent(createdSnap))).to.be.true;
  }
);

CreateSnapCommandHandlerUnitSuite.run();
