import { faker } from '@faker-js/faker';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SnapGeneratedEvent } from '@snppd/events';
import { GeneratedSnap } from '@snppd/shared';
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
    lang: faker.random.locale(),
    length: faker.datatype.number(),
    screenshotUrl: faker.image.imageUrl(),
    snapImageUrl: faker.image.imageUrl(),
    tags: [faker.word.noun(), faker.word.noun()],
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

SnapSagasUnitSuite.run();
