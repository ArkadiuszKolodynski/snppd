import { faker } from '@faker-js/faker';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SnapFailedEvent, SnapGeneratedEvent } from '@snppd/events';
import { GeneratedSnap } from '@snppd/shared';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { GenerateSnapHandler } from '../../../../src/app/snap/commands/handlers/generate-snap.handler';
import { SnapExecutor } from '../../../../src/app/snap/executors';

const GenerateSnapCommandHandlerUnitSuite = suite<{
  eventBus: EventBus;
  executor: SnapExecutor;
  generatedSnap: GeneratedSnap;
  handler: GenerateSnapHandler;
}>('GenerateSnapHandler - unit');

GenerateSnapCommandHandlerUnitSuite.before(async (context) => {
  const generatedSnap: GeneratedSnap = {
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
  };

  const module = await Test.createTestingModule({
    providers: [
      GenerateSnapHandler,
      EventBus,
      { provide: SnapExecutor, useValue: { generateSnap: () => generatedSnap } },
    ],
  })
    .overrideProvider(EventBus)
    .useValue({ publish: () => null })
    .compile();

  context.eventBus = module.get(EventBus);
  context.executor = module.get(SnapExecutor);
  context.generatedSnap = generatedSnap;
  context.handler = module.get(GenerateSnapHandler);
});

GenerateSnapCommandHandlerUnitSuite.after.each(() => {
  sinon.restore();
});

GenerateSnapCommandHandlerUnitSuite(
  'should call SnapExecutor.generateSnap method',
  async ({ executor, generatedSnap, handler }) => {
    const spy = sinon.spy(executor, 'generateSnap');

    await handler.execute({
      generateSnapDto: { tags: generatedSnap.tags, url: generatedSnap.url },
      userId: generatedSnap.userId,
    });

    expect(spy.calledOnceWithExactly(generatedSnap.url)).to.be.true;
  }
);

GenerateSnapCommandHandlerUnitSuite(
  'should publish SnapGeneratedEvent if snap was generated',
  async ({ eventBus, executor, generatedSnap, handler }) => {
    sinon.stub(executor, 'generateSnap').resolves(generatedSnap);
    const spy = sinon.spy(eventBus, 'publish');

    await handler.execute({
      generateSnapDto: { tags: generatedSnap.tags, url: generatedSnap.url },
      userId: generatedSnap.userId,
    });

    expect(spy.calledOnceWithExactly(new SnapGeneratedEvent(generatedSnap))).to.be.true;
  }
);

GenerateSnapCommandHandlerUnitSuite(
  'should publish SnapFailedEvent if there was an error while generating snap',
  async ({ eventBus, executor, generatedSnap, handler }) => {
    sinon.stub(executor, 'generateSnap').resolves(null);
    const spy = sinon.spy(eventBus, 'publish');

    await handler.execute({
      generateSnapDto: { tags: generatedSnap.tags, url: generatedSnap.url },
      userId: generatedSnap.userId,
    });

    expect(spy.calledOnceWithExactly(new SnapFailedEvent({ url: generatedSnap.url, userId: generatedSnap.userId }))).to
      .be.true;
  }
);

GenerateSnapCommandHandlerUnitSuite.run();
