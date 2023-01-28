import { faker } from '@faker-js/faker';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { Snap } from '@prisma-snap/client';
import { SnapUpdatedEvent } from '@snppd/events';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { UpdateSnapHandler } from '../../../../src/app/snap/commands/handlers/update-snap.handler';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';
import { UpdateSnapDto } from '../../../../src/app/snap/dto/update-snap.dto';

const UpdateSnapCommandHandlerUnitSuite = suite<{
  dao: SnapDao;
  eventBus: EventBus;
  handler: UpdateSnapHandler;
  updatedSnap: Snap;
}>('UpdateSnapHandler - unit');

UpdateSnapCommandHandlerUnitSuite.before(async (context) => {
  const updatedSnap: Snap = {
    author: faker.name.fullName(),
    content: faker.lorem.paragraph(),
    excerpt: faker.lorem.sentences(),
    lang: faker.random.locale(),
    length: faker.datatype.number(),
    screenshotUrl: faker.image.imageUrl(),
    snapImageUrl: faker.image.imageUrl(),
    tags: [faker.word.noun(), faker.word.noun()],
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    userId: faker.datatype.uuid(),
    id: faker.datatype.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
  };

  const module = await Test.createTestingModule({
    providers: [UpdateSnapHandler, EventBus, SnapDao],
  })
    .overrideProvider(EventBus)
    .useValue({ publish: () => null })
    .overrideProvider(SnapDao)
    .useValue({ update: () => updatedSnap })
    .compile();

  context.dao = module.get(SnapDao);
  context.eventBus = module.get(EventBus);
  context.handler = module.get(UpdateSnapHandler);
  context.updatedSnap = updatedSnap;
});

UpdateSnapCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

UpdateSnapCommandHandlerUnitSuite('should call SnapDao.update method', async ({ dao, handler }) => {
  const spy = sinon.spy(dao, 'update');
  const id = faker.datatype.uuid();
  const updateSnapDto: UpdateSnapDto = { tags: [faker.random.word(), faker.random.word()] };
  const userId = faker.datatype.uuid();

  await handler.execute({ id, updateSnapDto, userId });

  expect(spy.calledOnceWithExactly(id, updateSnapDto)).to.be.true;
});

UpdateSnapCommandHandlerUnitSuite('should publish SnapUpdatedEvent', async ({ eventBus, handler, updatedSnap }) => {
  const spy = sinon.spy(eventBus, 'publish');
  const id = faker.datatype.uuid();
  const updateSnapDto: UpdateSnapDto = { tags: [faker.random.word(), faker.random.word()] };
  const userId = faker.datatype.uuid();

  await handler.execute({ id, updateSnapDto, userId });

  expect(spy.calledOnceWithExactly(new SnapUpdatedEvent(updatedSnap))).to.be.true;
});

UpdateSnapCommandHandlerUnitSuite.run();
