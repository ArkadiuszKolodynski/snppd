import { faker } from '@faker-js/faker';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { DeleteSnapCommand } from '../../../src/app/snap/commands/impl/delete-snap.command';
import { EnqueueSnapGenerationCommand } from '../../../src/app/snap/commands/impl/enqueue-snap-generation.command';
import { ScheduleSnapsPruneCommand } from '../../../src/app/snap/commands/impl/schedule-snaps-prune.command';
import { GenerateSnapDto } from '../../../src/app/snap/dto';
import { SnapService } from '../../../src/app/snap/snap.service';

const SnapServiceUnitSuite = suite<{ commandBus: CommandBus; service: SnapService }>('SnapService - unit');

SnapServiceUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [CommandBus, SnapService],
  })
    .overrideProvider(CommandBus)
    .useValue({ execute: () => null })
    .compile();

  context.commandBus = module.get(CommandBus);
  context.service = module.get(SnapService);
});

SnapServiceUnitSuite.after.each(() => {
  sinon.restore();
});

SnapServiceUnitSuite(
  '#onApplicationBootstrap should call CommandBus.execute method',
  async ({ commandBus, service }) => {
    const spy = sinon.spy(commandBus, 'execute');

    await service.onApplicationBootstrap();

    expect(spy.calledOnceWithExactly(new ScheduleSnapsPruneCommand())).to.be.true;
  }
);

SnapServiceUnitSuite('#generate should call CommandBus.execute method', async ({ commandBus, service }) => {
  const spy = sinon.spy(commandBus, 'execute');
  const generateSnapDto: GenerateSnapDto = {
    url: faker.internet.url(),
    tags: [faker.random.word(), faker.random.word()],
  };
  const userId = faker.datatype.uuid();

  await service.generate(generateSnapDto, userId);

  expect(spy.calledOnceWithExactly(new EnqueueSnapGenerationCommand(generateSnapDto, userId))).to.be.true;
});

SnapServiceUnitSuite('#delete should call CommandBus.execute method', async ({ commandBus, service }) => {
  const spy = sinon.spy(commandBus, 'execute');
  const id = faker.datatype.uuid();
  const userId = faker.datatype.uuid();

  await service.delete(id, userId);

  expect(spy.calledOnceWithExactly(new DeleteSnapCommand(id, userId))).to.be.true;
});

SnapServiceUnitSuite.run();
