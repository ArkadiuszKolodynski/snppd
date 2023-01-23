import { Logger } from '@nestjs/common';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as registerQueryLogMiddlewareWrapper from '../../../src/lib/middlewares/query-log.middleware';
import { PrismaService } from '../../../src/lib/prisma.service';

const QueryLogMiddlewareSuite = suite<{
  ServiceStub: sinon.SinonStubbedInstance<typeof PrismaService>;
  LoggerStub: sinon.SinonStubbedInstance<typeof Logger>;
}>('QueryLogMiddlewareSuite');

QueryLogMiddlewareSuite.before.each(async (context) => {
  context.ServiceStub = PrismaService;
  context.LoggerStub = sinon.stub(Logger);
});

QueryLogMiddlewareSuite.after.each(() => {
  sinon.restore();
});

QueryLogMiddlewareSuite('should register callback on query', async ({ ServiceStub, LoggerStub }) => {
  const spy = sinon.spy(PrismaService.prototype, '$on');

  registerQueryLogMiddlewareWrapper.registerQueryLogMiddleware(new ServiceStub(), new LoggerStub());

  expect(spy.calledOnceWithExactly('query' as never, sinon.match.func)).to.be.true;
});

QueryLogMiddlewareSuite.run();
