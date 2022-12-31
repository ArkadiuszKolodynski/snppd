import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@snppd/models';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';

const createSnapUnitSuite = suite<{ app: INestApplication; dao: SnapDao; service: PrismaService }>(
  'Create Snap - unit'
);

createSnapUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    imports: [ConfigModule],
    providers: [SnapDao, { provide: PrismaService, useValue: { snap: { create: () => null } } }],
  }).compile();

  context.dao = module.get(SnapDao);
  context.service = module.get(PrismaService);
});

createSnapUnitSuite.after.each(() => {
  sinon.restore();
});

createSnapUnitSuite('should call PrismaService.snap.create method', async ({ dao, service }) => {
  const spy = sinon.spy(service.snap, 'create');
  const data: Prisma.SnapCreateInput = {
    name: faker.random.words(3),
    url: faker.internet.url(),
    tags: [faker.random.word(), faker.random.word()],
    title: faker.lorem.sentence(3),
    imageUrl: faker.internet.url(),
  };

  await dao.create(data);

  expect(spy.calledOnceWithExactly({ data })).to.be.true;
});

createSnapUnitSuite.run();
