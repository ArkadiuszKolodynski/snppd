import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma-snap/client';
import { Logger, LoggerMock } from '@snppd/logger';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { DatabaseService } from '../../../src/app/database/database.service';

const DatabaseServiceSuite = suite<{
  module: TestingModule;
  service: DatabaseService;
  connectStub: sinon.SinonStub;
  onStub: sinon.SinonStub;
  useStub: sinon.SinonStub;
}>('DatabaseServiceSuite');

DatabaseServiceSuite.before(async (context) => {
  context.module = await Test.createTestingModule({
    providers: [DatabaseService, Logger],
  })
    .overrideProvider(Logger)
    .useClass(LoggerMock)
    .compile();

  context.service = context.module.get(DatabaseService);
});

DatabaseServiceSuite.before.each((context) => {
  context.connectStub = sinon.stub(DatabaseService.prototype, '$connect');
  context.onStub = sinon.stub(DatabaseService.prototype, '$on');
  context.useStub = sinon.stub(DatabaseService.prototype, '$use');
});

DatabaseServiceSuite.after.each(() => {
  sinon.restore();
});

DatabaseServiceSuite('should connect to database', async ({ service, connectStub }) => {
  await service.onModuleInit();

  expect(connectStub.calledOnce).to.be.true;
});

DatabaseServiceSuite('should register query log middleware', async ({ service, onStub }) => {
  await service.onModuleInit();

  expect(onStub.calledWith('query', sinon.match.func)).to.be.true;
});

DatabaseServiceSuite('should register find snap middleware', async ({ service, useStub }) => {
  await service.onModuleInit();

  expect(useStub.calledWith(sinon.match.func)).to.be.true;
});

DatabaseServiceSuite('should register shutdown hooks', async ({ module, service, onStub }) => {
  const app = module.createNestApplication();

  await service.enableShutdownHooks(app);

  expect(onStub.calledWith('beforeExit', sinon.match.func)).to.be.true;
});

DatabaseServiceSuite('should close the app', async ({ module, service }) => {
  const app = module.createNestApplication();
  const stub = sinon.stub(app, 'close');

  await service.closeApp(app);

  expect(stub.calledOnce).to.be.true;
});

DatabaseServiceSuite('#registerQueryLogs should log queries', async ({ service }) => {
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

DatabaseServiceSuite(
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

DatabaseServiceSuite('#registerSoftDeleteMiddleware should define args object', async ({ service }) => {
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

DatabaseServiceSuite(
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

DatabaseServiceSuite(
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

DatabaseServiceSuite(
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

DatabaseServiceSuite(
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

DatabaseServiceSuite(
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

DatabaseServiceSuite.run();
