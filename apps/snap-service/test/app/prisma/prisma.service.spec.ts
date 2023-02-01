import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma-snap/client';
import { Logger, LoggerMock } from '@snppd/logger';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { PrismaService } from '../../../src/app/prisma/prisma.service';

const PrismaServiceSuite = suite<{
  module: TestingModule;
  service: PrismaService;
  connectStub: sinon.SinonStub;
  onStub: sinon.SinonStub;
  useStub: sinon.SinonStub;
}>('PrismaServiceSuite');

PrismaServiceSuite.before(async (context) => {
  context.module = await Test.createTestingModule({
    providers: [PrismaService, Logger],
  })
    .overrideProvider(Logger)
    .useClass(LoggerMock)
    .compile();

  context.service = context.module.get(PrismaService);
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

PrismaServiceSuite('should close the app', async ({ module, service }) => {
  const app = module.createNestApplication();
  const stub = sinon.stub(app, 'close');

  await service.closeApp(app);

  expect(stub.calledOnce).to.be.true;
});

PrismaServiceSuite('#registerQueryLogs should log queries', async ({ service }) => {
  const event: Prisma.QueryEvent = {
    duration: faker.datatype.number(),
    params: faker.random.words(),
    query: faker.random.words(),
    target: faker.random.word(),
    timestamp: faker.date.recent(),
  };
  const spy = sinon.spy(service['logger'], 'info');

  service.registerQueryLogs(event);

  expect(spy.calledTwice).to.be.true;
});

PrismaServiceSuite(
  '#registerSoftDeleteMiddleware should not mutate params if model is not Snap',
  async ({ service }) => {
    const params: Prisma.MiddlewareParams = {
      action: 'delete',
      args: { where: {} },
      dataPath: [],
      runInTransaction: false,
      model: 'notSnap' as unknown as 'Snap',
    };
    const next = sinon.fake();

    service.registerSoftDeleteMiddleware(params, next);

    expect(next.calledOnceWith(params)).to.be.true;
  }
);

PrismaServiceSuite('#registerSoftDeleteMiddleware should define args object', async ({ service }) => {
  const params: Prisma.MiddlewareParams = {
    action: 'findMany',
    args: null,
    dataPath: [],
    runInTransaction: false,
    model: 'Snap',
  };
  const next = sinon.fake();

  service.registerSoftDeleteMiddleware(params, next);

  expect(next.calledOnceWith({ ...params, args: sinon.match.object })).to.be.true;
});

PrismaServiceSuite(
  '#registerSoftDeleteMiddleware should not mutate params if action is not findFirst, findUnique or findMany',
  async ({ service }) => {
    const params: Prisma.MiddlewareParams = {
      action: 'delete',
      args: { where: {} },
      dataPath: [],
      runInTransaction: false,
      model: 'Snap',
    };
    const next = sinon.fake();

    service.registerSoftDeleteMiddleware(params, next);

    expect(next.calledOnceWith(params)).to.be.true;
  }
);

PrismaServiceSuite(
  '#registerSoftDeleteMiddleware should add deletedAt arg as null if provided action was findFirst',
  async ({ service }) => {
    const params: Prisma.MiddlewareParams = {
      action: 'findFirst',
      args: { where: {} },
      dataPath: [],
      runInTransaction: false,
      model: 'Snap',
    };
    const next = sinon.fake();

    service.registerSoftDeleteMiddleware(params, next);

    expect(next.calledOnceWith({ ...params, args: { where: { deletedAt: null } } })).to.be.true;
  }
);

PrismaServiceSuite(
  '#registerSoftDeleteMiddleware should change action to findFirst if provided was findUnique and add deletedAt arg as null',
  async ({ service }) => {
    const params: Prisma.MiddlewareParams = {
      action: 'findUnique',
      args: { where: {} },
      dataPath: [],
      runInTransaction: false,
      model: 'Snap',
    };
    const next = sinon.fake();

    service.registerSoftDeleteMiddleware(params, next);

    expect(next.calledOnceWith({ ...params, action: 'findFirst', args: { where: { deletedAt: null } } })).to.be.true;
  }
);

PrismaServiceSuite(
  '#registerSoftDeleteMiddleware should add deletedAt arg as null if provided action was findMany and where arg exist',
  async ({ service }) => {
    const params: Prisma.MiddlewareParams = {
      action: 'findMany',
      args: { where: {} },
      dataPath: [],
      runInTransaction: false,
      model: 'Snap',
    };
    const next = sinon.fake();

    service.registerSoftDeleteMiddleware(params, next);

    expect(next.calledOnceWith({ ...params, args: { where: { deletedAt: null } } })).to.be.true;
  }
);

PrismaServiceSuite(
  '#registerSoftDeleteMiddleware should add where arg with deletedAt arg as null if provided action was findMany and where arg not exist',
  async ({ service }) => {
    const params: Prisma.MiddlewareParams = {
      action: 'findMany',
      args: {},
      dataPath: [],
      runInTransaction: false,
      model: 'Snap',
    };
    const next = sinon.fake();

    service.registerSoftDeleteMiddleware(params, next);

    expect(next.calledOnceWith({ ...params, args: { where: { deletedAt: null } } })).to.be.true;
  }
);

PrismaServiceSuite.run();
