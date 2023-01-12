import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { SnapFailedEvent } from '@snppd/events';
import { FailedSnap } from '@snppd/shared';
import { WebSocketService } from '@snppd/websockets';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { SnapFailedHandler } from '../../../../src/app/snap/events/snap-failed.handler';

const SnapFailedEventHandlerUnitSuite = suite<{
  failedSnap: FailedSnap;
  handler: SnapFailedHandler;
  websocketService: WebSocketService;
}>('SnapFailedHandler - unit');

SnapFailedEventHandlerUnitSuite.before(async (context) => {
  const failedSnap: FailedSnap = {
    url: faker.internet.url(),
    userId: faker.datatype.uuid(),
  };

  const module = await Test.createTestingModule({ providers: [SnapFailedHandler, WebSocketService] })
    .overrideProvider(WebSocketService)
    .useValue({ emit: () => null })
    .compile();

  context.failedSnap = failedSnap;
  context.handler = module.get(SnapFailedHandler);
  context.websocketService = module.get(WebSocketService);
});

SnapFailedEventHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

SnapFailedEventHandlerUnitSuite(
  'should emit SnapCreatedEvent to the client',
  async ({ failedSnap, handler, websocketService }) => {
    const spy = sinon.spy(websocketService, 'emit');
    const event = new SnapFailedEvent(failedSnap);

    handler.handle(event);

    expect(spy.calledOnceWithExactly(SnapFailedEvent.name, failedSnap)).to.be.true;
  }
);

SnapFailedEventHandlerUnitSuite.run();
