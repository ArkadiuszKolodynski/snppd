import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as registerFindSnapMiddlewareWrapper from '../../../src/lib/middlewares/find-snap.middleware';
import { PrismaService } from '../../../src/lib/prisma.service';

const FindSnapMiddlewareSuite = suite<{
  ServiceStub: sinon.SinonStubbedInstance<typeof PrismaService>;
}>('FindSnapMiddlewareSuite');

FindSnapMiddlewareSuite.before(async (context) => {
  context.ServiceStub = sinon.stub(PrismaService);
});

FindSnapMiddlewareSuite.after.each(() => {
  sinon.restore();
});

FindSnapMiddlewareSuite('should register middleware', async ({ ServiceStub }) => {
  const spy = sinon.spy(PrismaService.prototype, '$use');

  registerFindSnapMiddlewareWrapper.registerFindSnapMiddleware(new ServiceStub());

  expect(spy.calledOnceWithExactly(sinon.match.func)).to.be.true;
});

FindSnapMiddlewareSuite.run();
