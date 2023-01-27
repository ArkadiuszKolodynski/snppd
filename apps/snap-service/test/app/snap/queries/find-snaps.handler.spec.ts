import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { PageOptionsDto } from '@snppd/shared';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';
import { FindSnapsHandler } from '../../../../src/app/snap/queries/handlers/find-snaps.handler';

const FindSnapsQueryHandlerUnitSuite = suite<{ dao: SnapDao; handler: FindSnapsHandler }>('FindSnapsHandler - unit');

FindSnapsQueryHandlerUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [FindSnapsHandler, SnapDao],
  })
    .overrideProvider(SnapDao)
    .useValue({ findManyAndCount: () => [[], 0] })
    .compile();

  context.dao = module.get(SnapDao);
  context.handler = module.get(FindSnapsHandler);
});

FindSnapsQueryHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

FindSnapsQueryHandlerUnitSuite('should call SnapDao.findManyAndCount method', async ({ dao, handler }) => {
  const spy = sinon.spy(dao, 'findManyAndCount');
  const pageOptionsDto = new PageOptionsDto();
  const userId = faker.datatype.uuid();

  await handler.execute({ pageOptionsDto, userId });

  expect(spy.calledOnceWithExactly(pageOptionsDto, userId)).to.be.true;
});

FindSnapsQueryHandlerUnitSuite.run();
