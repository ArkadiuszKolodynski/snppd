import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { FailedSnap, GeneratedSnap } from '@snppd/common';
import { SnapFailureEvent, SnapGeneratedEvent } from '@snppd/events';
import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { CreateSnapCommand } from '../../../../src/app/snap/commands/impl/create-snap.command';
import { SnapSagas } from '../../../../src/app/snap/sagas/snap.sagas';

const snapSagasUnitSuite = suite<{
  app: INestApplication;
  sagas: SnapSagas;
  testScheduler: TestScheduler;
}>('Handle Snap Generated Event - unit');

snapSagasUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    imports: [CqrsModule],
    providers: [SnapSagas],
  }).compile();

  context.sagas = module.get(SnapSagas);
});

snapSagasUnitSuite.before.each((context) => {
  context.testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).deep.equal(expected);
  });
});

snapSagasUnitSuite.after.each(() => {
  sinon.restore();
});

snapSagasUnitSuite('should call new CreateSnapCommand on SnapGeneratedEvent', async ({ sagas, testScheduler }) => {
  const generatedSnap: GeneratedSnap = {
    name: faker.random.words(3),
    url: faker.internet.url(),
    title: faker.lorem.sentence(3),
    imageUrl: faker.internet.url(),
    htmlContent: faker.lorem.paragraphs(2),
    textContent: faker.lorem.paragraphs(2),
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

snapSagasUnitSuite('should return null on SnapFailureEvent', async ({ sagas, testScheduler }) => {
  const failedSnap: FailedSnap = {
    name: faker.random.words(3),
    url: faker.internet.url(),
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

snapSagasUnitSuite.run();
