import { faker } from '@faker-js/faker';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { Snap } from '@prisma/client';
import { FailedSnap, GeneratedSnap } from '@snppd/shared';
import { SnapCreatedEvent, SnapFailureEvent, SnapGeneratedEvent } from '@snppd/events';
import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { CreateSnapCommand } from '../../../../src/app/snap/commands/impl/create-snap.command';
import { SnapSagas } from '../../../../src/app/snap/sagas/snap.sagas';

const SnapSagasUnitSuite = suite<{ sagas: SnapSagas; testScheduler: TestScheduler }>('SnapSagas - unit');

SnapSagasUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    imports: [CqrsModule],
    providers: [SnapSagas],
  }).compile();

  context.sagas = module.get(SnapSagas);
});

SnapSagasUnitSuite.before.each((context) => {
  context.testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).deep.equal(expected);
  });
});

SnapSagasUnitSuite.after.each(() => {
  sinon.restore();
});

SnapSagasUnitSuite('should call new CreateSnapCommand on SnapGeneratedEvent', async ({ sagas, testScheduler }) => {
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

  testScheduler.run(({ hot, expectObservable }) => {
    const events$ = hot('-v---- 5s -v--|', {
      v: new SnapGeneratedEvent(generatedSnap),
    });

    const output$ = sagas.snapGenerated(events$);

    expectObservable(output$).toBe('-s---- 5s -s--|', {
      s: new CreateSnapCommand(generatedSnap),
    });
  });
});

SnapSagasUnitSuite('should return null on SnapCreatedEvent', async ({ sagas, testScheduler }) => {
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

  testScheduler.run(({ hot, expectObservable }) => {
    const events$ = hot('-v---- 5s -v--|', {
      v: new SnapCreatedEvent(createdSnap),
    });

    const output$ = sagas.snapCreated(events$);

    expectObservable(output$).toBe('-s---- 5s -s--|', {
      s: null,
    });
  });
});

SnapSagasUnitSuite('should return null on SnapFailureEvent', async ({ sagas, testScheduler }) => {
  const failedSnap: FailedSnap = {
    url: faker.internet.url(),
    userId: faker.datatype.uuid(),
  };

  testScheduler.run(({ hot, expectObservable }) => {
    const events$ = hot('-v---- 5s -v--|', {
      v: new SnapFailureEvent(failedSnap),
    });

    const output$ = sagas.snapFailure(events$);

    expectObservable(output$).toBe('-s---- 5s -s--|', {
      s: null,
    });
  });
});

SnapSagasUnitSuite.run();
