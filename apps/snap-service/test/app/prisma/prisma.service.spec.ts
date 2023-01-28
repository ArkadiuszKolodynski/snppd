import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma-snap/client';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { PrismaService } from '../../../src/app/prisma/prisma.service';

const PrismaServiceSuite = suite<{
  logger: Logger;
  module: TestingModule;
  service: PrismaService;
  connectStub: sinon.SinonStub;
  onStub: sinon.SinonStub;
  useStub: sinon.SinonStub;
}>('PrismaServiceSuite');

PrismaServiceSuite.before(async (context) => {
  try {
    context.module = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: Logger,
          useValue: {
            debug: () => null,
            log: () => null,
          },
        },
      ],
    }).compile();

    context.logger = context.module.get(Logger);
    context.service = context.module.get(PrismaService);
  } catch (err) {
    console.log(err);
  }
});

PrismaServiceSuite.before.each((context) => {
  context.connectStub = sinon.stub(PrismaService.prototype, '$connect');
  context.onStub = sinon.stub(PrismaService.prototype, '$on');
  context.useStub = sinon.stub(PrismaService.prototype, '$use');
});

PrismaServiceSuite.after.each(() => {
  sinon.restore();
});

PrismaServiceSuite('should connect to database', async ({ service, connectStub }) => {
  await service.onModuleInit();

  expect(connectStub.calledOnce).to.be.true;
});

PrismaServiceSuite('should register query log middleware', async ({ service, onStub }) => {
  await service.onModuleInit();

  expect(onStub.calledWith('query', sinon.match.func)).to.be.true;
});

PrismaServiceSuite('should register find snap middleware', async ({ service, useStub }) => {
  await service.onModuleInit();

  expect(useStub.calledWith(sinon.match.func)).to.be.true;
});

PrismaServiceSuite('should register shutdown hooks', async ({ module, service, onStub }) => {
  const app = module.createNestApplication();

  await service.enableShutdownHooks(app);

  expect(onStub.calledWith('beforeExit', sinon.match.func)).to.be.true;
});

PrismaServiceSuite('#registerQueryLogs should log queries', async ({ logger, service }) => {
  const event: Prisma.QueryEvent = {
    duration: faker.datatype.number(),
    params: faker.random.words(),
    query: faker.random.words(),
    target: faker.random.word(),
    timestamp: faker.date.recent(),
  };
  const spy = sinon.spy(logger, 'debug');

  service.registerQueryLogs(event);

  expect(spy.calledTwice).to.be.true;
});

PrismaServiceSuite.run();
