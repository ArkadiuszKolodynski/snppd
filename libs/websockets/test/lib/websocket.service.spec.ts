import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { WebSocketService } from '../../src';

const WebSocketServiceUnitSuite = suite<{
  webSocketService: WebSocketService;
}>('WebSocketService - unit');

WebSocketServiceUnitSuite.before(async (context) => {
  context.webSocketService = new WebSocketService();
});

WebSocketServiceUnitSuite.before.each(async (context) => {
  sinon.stub(context.webSocketService, 'server').value({
    emit: () => null,
  });
});

WebSocketServiceUnitSuite.after.each(() => {
  sinon.restore();
});

WebSocketServiceUnitSuite('#emit should call Server.emit method', async ({ webSocketService }) => {
  const spy = sinon.spy(webSocketService.server, 'emit');
  const messageName = faker.random.word();
  const data = faker.datatype.json();

  webSocketService.emit(messageName, data);

  expect(spy.calledOnceWithExactly(messageName, data)).to.be.true;
});

WebSocketServiceUnitSuite.run();
