import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { Snap } from '@prisma/client';
import { SnapCreatedEvent } from '@snppd/events';
import { WebSocketService } from '@snppd/websockets';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { SnapCreatedHandler } from '../../../../src/app/snap/events/snap-created.handler';

const SnapCreatedEventHandlerUnitSuite = suite<{
  createdSnap: Snap;
  handler: SnapCreatedHandler;
  websocketService: WebSocketService;
}>('SnapCreatedHandler - unit');

SnapCreatedEventHandlerUnitSuite.before(async (context) => {
  const createdSnap: Snap = {
    author: faker.name.fullName(),
    content: faker.lorem.paragraph(),
    excerpt: faker.lorem.sentences(),
    htmlContent: faker.lorem.paragraph(),
    lang: faker.random.locale(),
    length: faker.datatype.number(),
    screenshotUrl: faker.image.imageUrl(),
    snapImageUrl: faker.image.imageUrl(),
    tags: [faker.word.noun(), faker.word.noun()],
    textContent: faker.lorem.paragraph(),
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    userId: faker.datatype.uuid(),
    id: faker.datatype.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
  };

  const module = await Test.createTestingModule({ providers: [SnapCreatedHandler, WebSocketService] })
    .overrideProvider(WebSocketService)
    .useValue({ emit: () => null })
    .compile();

  context.createdSnap = createdSnap;
  context.handler = module.get(SnapCreatedHandler);
  context.websocketService = module.get(WebSocketService);
});

SnapCreatedEventHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

SnapCreatedEventHandlerUnitSuite(
  'should emit SnapCreatedEvent to the client',
  async ({ createdSnap, handler, websocketService }) => {
    const spy = sinon.spy(websocketService, 'emit');
    const event = new SnapCreatedEvent(createdSnap);

    handler.handle(event);

    expect(spy.calledOnceWithExactly(SnapCreatedEvent.name, createdSnap)).to.be.true;
  }
);

SnapCreatedEventHandlerUnitSuite.run();
