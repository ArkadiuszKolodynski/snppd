import { faker } from '@faker-js/faker';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SnapDeletedEvent } from '@snppd/events';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { DeleteSnapHandler } from '../../../../src/app/snap/commands/handlers/delete-snap.handler';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';

const DeleteSnapCommandHandlerUnitSuite = suite<{
  dao: SnapDao;
  eventBus: EventBus;
  handler: DeleteSnapHandler;
}>('DeleteSnapHandler - unit');

DeleteSnapCommandHandlerUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [DeleteSnapHandler, EventBus, SnapDao],
  })
    .overrideProvider(EventBus)
    .useValue({ publish: () => null })
    .overrideProvider(SnapDao)
    .useValue({ delete: () => null })
    .compile();

  context.dao = module.get(SnapDao);
  context.eventBus = module.get(EventBus);
  context.handler = module.get(DeleteSnapHandler);
});

DeleteSnapCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

DeleteSnapCommandHandlerUnitSuite('should call SnapDao.delete method', async ({ dao, handler }) => {
  const spy = sinon.spy(dao, 'delete');
  const id = faker.datatype.uuid();
  const userId = faker.datatype.uuid();

  await handler.execute({ id, userId });

  expect(spy.calledOnceWithExactly(id)).to.be.true;
});

DeleteSnapCommandHandlerUnitSuite('should publish SnapDeletedEvent', async ({ eventBus, handler }) => {
  const spy = sinon.spy(eventBus, 'publish');
  const id = faker.datatype.uuid();
  const userId = faker.datatype.uuid();

  await handler.execute({ id, userId });

  expect(spy.calledOnceWithExactly(new SnapDeletedEvent(id))).to.be.true;
});

DeleteSnapCommandHandlerUnitSuite.run();
