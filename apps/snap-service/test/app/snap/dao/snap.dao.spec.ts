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

createSnapUnitSuite.run();
