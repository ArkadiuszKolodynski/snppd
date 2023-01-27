import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';
import { FindSnapByIdHandler } from '../../../../src/app/snap/queries/handlers/find-snap-by-id.handler';

const FindSnapByIdQueryHandlerUnitSuite = suite<{
  dao: SnapDao;
  handler: FindSnapByIdHandler;
}>('FindSnapByIdHandler - unit');

FindSnapByIdQueryHandlerUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [FindSnapByIdHandler, SnapDao],
  })
    .overrideProvider(SnapDao)
    .useValue({ findById: () => ({ id: faker.datatype.uuid() }) })
    .compile();

  context.dao = module.get(SnapDao);
  context.handler = module.get(FindSnapByIdHandler);
});

FindSnapByIdQueryHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

FindSnapByIdQueryHandlerUnitSuite('should call SnapDao.findById method', async ({ dao, handler }) => {
  const spy = sinon.spy(dao, 'findById');
  const id = faker.datatype.uuid();
  const userId = faker.datatype.uuid();

  await handler.execute({ id, userId });

  expect(spy.calledOnceWithExactly(id)).to.be.true;
});

FindSnapByIdQueryHandlerUnitSuite('should throw NotFoundException if snap was not found', async ({ dao, handler }) => {
  sinon.stub(dao, 'findById').returns(null);
  const id = faker.datatype.uuid();
  const userId = faker.datatype.uuid();

  try {
    await handler.execute({ id, userId });
  } catch (err) {
    expect(err).to.be.instanceOf(NotFoundException);
  }
});

FindSnapByIdQueryHandlerUnitSuite.run();
