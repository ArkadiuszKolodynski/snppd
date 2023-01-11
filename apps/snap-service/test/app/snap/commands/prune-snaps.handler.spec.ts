import { faker } from '@faker-js/faker';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SnapsPrunedEvent } from '@snppd/events';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { PruneSnapsHandler } from '../../../../src/app/snap/commands/handlers/prune-snaps.handler';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';

const PruneSnapsCommandHandlerUnitSuite = suite<{
  dao: SnapDao;
  deletedSnapIds: string[];
  eventBus: EventBus;
  handler: PruneSnapsHandler;
}>('PruneSnapsHandler - unit');

PruneSnapsCommandHandlerUnitSuite.before(async (context) => {
  const deletedSnapIds = [{ id: faker.datatype.uuid() }, { id: faker.datatype.uuid() }];
  const module = await Test.createTestingModule({
    providers: [PruneSnapsHandler, EventBus, SnapDao],
  })
    .overrideProvider(EventBus)
    .useValue({ publish: () => null })
    .overrideProvider(SnapDao)
    .useValue({ prune: () => deletedSnapIds })
    .compile();

  context.dao = module.get(SnapDao);
  context.deletedSnapIds = deletedSnapIds.map((deletedSnap) => deletedSnap.id);
  context.eventBus = module.get(EventBus);
  context.handler = module.get(PruneSnapsHandler);
});

PruneSnapsCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

PruneSnapsCommandHandlerUnitSuite('should call SnapDao.prune method', async ({ dao, handler }) => {
  const spy = sinon.spy(dao, 'prune');

  await handler.execute();

  expect(spy.calledOnce).to.be.true;
});

PruneSnapsCommandHandlerUnitSuite('should publish SnapsPrunedEvent', async ({ eventBus, deletedSnapIds, handler }) => {
  const spy = sinon.spy(eventBus, 'publish');

  await handler.execute();

  expect(spy.calledOnceWithExactly(new SnapsPrunedEvent(deletedSnapIds))).to.be.true;
});

PruneSnapsCommandHandlerUnitSuite.run();
