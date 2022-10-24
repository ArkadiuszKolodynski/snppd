import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GeneratedSnap } from '@snppd/common';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { CreateSnapHandler } from '../../../../src/app/snap/commands/handlers/create-snap.handler';
import { SnapDao } from '../../../../src/app/snap/dao/snap.dao';

const createSnapCommandHandlerUnitSuite = suite<{ app: INestApplication; dao: SnapDao; handler: CreateSnapHandler }>(
  'Create Snap Command Handler - unit'
);

createSnapCommandHandlerUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [CreateSnapHandler, SnapDao],
  })
    .overrideProvider(SnapDao)
    .useValue({ create: () => null })
    .compile();

  context.dao = module.get(SnapDao);
  context.handler = module.get(CreateSnapHandler);
});

createSnapCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

createSnapCommandHandlerUnitSuite('should call SnapDao.create method', async ({ dao, handler }) => {
  const spy = sinon.spy(dao, 'create');
  const generatedSnap: GeneratedSnap = {
    name: faker.random.words(3),
    url: faker.internet.url(),
    title: faker.lorem.sentence(3),
    imageUrl: faker.internet.url(),
    htmlContent: faker.lorem.paragraphs(2),
    textContent: faker.lorem.paragraphs(2),
  };

  await handler.execute({ generatedSnap });

  expect(spy.calledOnceWithExactly(generatedSnap)).to.be.true;
});

createSnapCommandHandlerUnitSuite.run();
