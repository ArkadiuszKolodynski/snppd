import { faker } from '@faker-js/faker';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { Logger, LoggerMock } from '@snppd/logger';
import { Job } from 'bull';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { GenerateSnapCommand } from '../../../src/app/snap/commands/impl/generate-snap.command';
import { PruneSnapsCommand } from '../../../src/app/snap/commands/impl/prune-snaps.command';
import { GenerateSnapDto } from '../../../src/app/snap/dto';
import { SnapProcessor } from '../../../src/app/snap/snap.processor';

const SnapProcessorUnitSuite = suite<{ commandBus: CommandBus; processor: SnapProcessor }>('SnapProcessor - unit');

SnapProcessorUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [CommandBus, SnapProcessor, Logger],
  })
    .overrideProvider(CommandBus)
    .useValue({ execute: () => null })
    .overrideProvider(Logger)
    .useClass(LoggerMock)
    .compile();

  context.commandBus = module.get(CommandBus);
  context.processor = module.get(SnapProcessor);
});

SnapProcessorUnitSuite.after.each(() => {
  sinon.restore();
});

SnapProcessorUnitSuite('should log job info on active', async ({ processor }) => {
  const loggerStub = sinon.stub(processor['logger'], 'debug');
  const url = faker.internet.url();
  const tags = [faker.word.noun(), faker.word.noun()];
  const userId = faker.datatype.uuid();
  const job = { data: { generateSnapDto: { tags, url }, userId } } as Job<{
    generateSnapDto: GenerateSnapDto;
    userId: string;
  }>;

  processor.onActive(job);

  expect(loggerStub.calledOnceWith(sinon.match(JSON.stringify(job.data)))).to.be.true;
});

SnapProcessorUnitSuite('should log error on failed', async ({ processor }) => {
  const loggerStub = sinon.stub(processor['logger'], 'error');
  const url = faker.internet.url();
  const tags = [faker.word.noun(), faker.word.noun()];
  const userId = faker.datatype.uuid();
  const job = { data: { generateSnapDto: { tags, url }, userId } } as Job<{
    generateSnapDto: GenerateSnapDto;
    userId: string;
  }>;

  processor.onFailed(job, new Error('Something went wrong'));

  expect(loggerStub.calledOnceWith(sinon.match(JSON.stringify(job.data)))).to.be.true;
});

SnapProcessorUnitSuite('#generateSnap should call CommandBus.execute method', async ({ commandBus, processor }) => {
  const spy = sinon.spy(commandBus, 'execute');
  const generateSnapDto: GenerateSnapDto = { tags: [faker.word.noun(), faker.word.noun()], url: faker.internet.url() };
  const userId = faker.datatype.uuid();
  const job = { data: { generateSnapDto, userId } } as Job<{ generateSnapDto: GenerateSnapDto; userId: string }>;

  await processor.generateSnap(job);

  expect(spy.calledOnceWithExactly(new GenerateSnapCommand(generateSnapDto, userId))).to.be.true;
});

SnapProcessorUnitSuite('#pruneSnaps should call CommandBus.execute method', async ({ commandBus, processor }) => {
  const spy = sinon.spy(commandBus, 'execute');

  await processor.pruneSnaps();

  expect(spy.calledOnceWithExactly(new PruneSnapsCommand())).to.be.true;
});

SnapProcessorUnitSuite.run();
