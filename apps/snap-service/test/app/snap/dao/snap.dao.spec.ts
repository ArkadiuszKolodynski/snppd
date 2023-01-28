import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma-snap/client';
import { PageOptionsDto } from '@snppd/shared';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { PrismaService } from '../../../../src/app/prisma/prisma.service';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';

const SnapDaoUnitSuite = suite<{ dao: SnapDao; service: PrismaService }>('SnapDao - unit');

SnapDaoUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    imports: [ConfigModule],
    providers: [SnapDao, PrismaService],
  })
    .overrideProvider(PrismaService)
    .useValue({
      snap: {
        create: () => null,
        count: () => null,
        findMany: () => null,
        findUnique: () => null,
        update: () => undefined,
      },
      $transaction: () => null,
      $queryRaw: () => null,
    })
    .compile();

  context.dao = module.get(SnapDao);
  context.service = module.get(PrismaService);
});

SnapDaoUnitSuite.after.each(() => {
  sinon.restore();
});

SnapDaoUnitSuite(
  '#findMany should call PrismaService.snap.findMany and PrismaService.snap.count method',
  async ({ dao, service }) => {
    const findSpy = sinon.spy(service.snap, 'findMany');
    const countSpy = sinon.spy(service.snap, 'count');
    const { skip, order, page, take } = new PageOptionsDto();
    const userId = faker.datatype.uuid();

    await dao.findManyAndCount({ skip, order, page, take }, userId);

    expect(findSpy.calledOnceWith(sinon.match({ skip, take, orderBy: { createdAt: order } }))).to.be.true;
    expect(countSpy.calledOnce).to.be.true;
  }
);

SnapDaoUnitSuite('#findMany should call PrismaService.$transaction method', async ({ dao, service }) => {
  const spy = sinon.spy(service, '$transaction');
  const pageOptionsDto = new PageOptionsDto();
  const userId = faker.datatype.uuid();

  await dao.findManyAndCount(pageOptionsDto, userId);

  expect(spy.calledOnce).to.be.true;
});

SnapDaoUnitSuite('#findById should call PrismaService.snap.findUnique method', async ({ dao, service }) => {
  const spy = sinon.spy(service.snap, 'findUnique');
  const id = faker.datatype.uuid();

  await dao.findById(id);

  expect(spy.calledOnceWith(sinon.match({ where: { id } }))).to.be.true;
});

SnapDaoUnitSuite('#create should call PrismaService.snap.create method', async ({ dao, service }) => {
  const spy = sinon.spy(service.snap, 'create');
  const data: Prisma.SnapCreateInput = {
    author: faker.name.fullName(),
    content: faker.lorem.paragraph(),
    excerpt: faker.lorem.sentences(),
    id: faker.datatype.uuid(),
    lang: faker.random.locale(),
    length: faker.datatype.number(),
    screenshotUrl: faker.image.imageUrl(),
    snapImageUrl: faker.image.imageUrl(),
    tags: [faker.random.word(), faker.random.word()],
    title: faker.lorem.sentence(3),
    url: faker.internet.url(),
    userId: faker.datatype.uuid(),
  };

  await dao.create(data);

  expect(spy.calledOnceWithExactly({ data })).to.be.true;
});

SnapDaoUnitSuite('#update should call PrismaService.snap.update method', async ({ dao, service }) => {
  const spy = sinon.spy(service.snap, 'update');
  const id = faker.datatype.uuid();
  const data: Prisma.SnapUpdateInput = {
    tags: [faker.random.word(), faker.random.word()],
  };

  await dao.update(id, data);

  expect(spy.calledOnceWithExactly({ where: { id }, data })).to.be.true;
});

SnapDaoUnitSuite('#delete should call PrismaService.snap.update method', async ({ dao, service }) => {
  const spy = sinon.spy(service.snap, 'update');
  const id = faker.datatype.uuid();

  await dao.delete(id);

  expect(spy.calledOnceWith(sinon.match({ where: { id } }))).to.be.true;
});

SnapDaoUnitSuite('#delete should not throw if PrismaService.snap.update throws', async ({ dao, service }) => {
  sinon.stub(service.snap, 'update').throws();
  const id = faker.datatype.uuid();

  const result = await dao.delete(id);

  expect(result).to.be.null;
});

SnapDaoUnitSuite('#prune should call PrismaService.$queryRaw method', async ({ dao, service }) => {
  const spy = sinon.spy(service, '$queryRaw');

  await dao.prune();

  expect(spy.calledOnce).to.be.true;
});

SnapDaoUnitSuite.run();
