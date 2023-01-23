import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as registerFindSnapMiddlewareWrapper from '../../src/lib/middlewares/find-snap.middleware';
import * as registerQueryLogMiddlewareWrapper from '../../src/lib/middlewares/query-log.middleware';
import { PrismaService } from '../../src/lib/prisma.service';

const PrismaServiceSuite = suite<{
  module: TestingModule;
  service: PrismaService;
  connectStub: sinon.SinonStub;
  onStub: sinon.SinonStub;
  registerFindSnapMiddlewareStub: sinon.SinonStub;
  registerQueryLogMiddlewareStub: sinon.SinonStub;
}>('PrismaServiceSuite');

PrismaServiceSuite.before(async (context) => {
  context.module = await Test.createTestingModule({
    providers: [PrismaService],
  }).compile();

  context.service = context.module.get(PrismaService);
});

PrismaServiceSuite.before.each((context) => {
  context.connectStub = sinon.stub(PrismaService.prototype, '$connect');
  context.onStub = sinon.stub(PrismaService.prototype, '$on');
  context.registerFindSnapMiddlewareStub = sinon.stub(registerFindSnapMiddlewareWrapper, 'registerFindSnapMiddleware');
  context.registerQueryLogMiddlewareStub = sinon.stub(registerQueryLogMiddlewareWrapper, 'registerQueryLogMiddleware');
});

PrismaServiceSuite.after.each(() => {
  sinon.restore();
});

PrismaServiceSuite('should connect to database', async ({ service, connectStub }) => {
  await service.onModuleInit();

  expect(connectStub.calledOnce).to.be.true;
});

PrismaServiceSuite('should register query log middleware', async ({ service, registerQueryLogMiddlewareStub }) => {
  await service.onModuleInit();

  expect(registerQueryLogMiddlewareStub.calledOnce).to.be.true;
});

PrismaServiceSuite('should register find snap middleware', async ({ service, registerFindSnapMiddlewareStub }) => {
  await service.onModuleInit();

  expect(registerFindSnapMiddlewareStub.calledOnce).to.be.true;
});

PrismaServiceSuite('should register shutdown hooks', async ({ module, service, onStub }) => {
  const app = module.createNestApplication();

  await service.enableShutdownHooks(app);

  expect(onStub.calledOnceWithExactly('beforeExit', sinon.match.func)).to.be.true;
});

PrismaServiceSuite.run();
