import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@snppd/models';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';

const SnapDaoUnitSuite = suite<{ dao: SnapDao; service: PrismaService }>('SnapDao - unit');

SnapDaoUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    imports: [ConfigModule],
    providers: [SnapDao, PrismaService],
  })
    .overrideProvider(PrismaService)
    .useValue({ snap: { create: () => null, update: () => undefined }, $queryRaw: () => null })
    .compile();

  context.dao = module.get(SnapDao);
  context.service = module.get(PrismaService);
});

SnapDaoUnitSuite.after.each(() => {
  sinon.restore();
});

SnapDaoUnitSuite('#create should call PrismaService.snap.create method', async ({ dao, service }) => {
  const spy = sinon.spy(service.snap, 'create');
  const data: Prisma.SnapCreateInput = {
    author: faker.name.fullName(),
    content: faker.lorem.paragraph(),
    excerpt: faker.lorem.sentences(),
    htmlContent: faker.lorem.paragraph(),
    id: faker.datatype.uuid(),
    lang: faker.random.locale(),
    length: faker.datatype.number(),
    screenshotUrl: faker.image.imageUrl(),
    snapImageUrl: faker.image.imageUrl(),
    tags: [faker.random.word(), faker.random.word()],
    textContent: faker.lorem.paragraph(),
    title: faker.lorem.sentence(3),
    url: faker.internet.url(),
    userId: faker.datatype.uuid(),
  };

  await dao.create(data);

  expect(spy.calledOnceWithExactly({ data })).to.be.true;
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
