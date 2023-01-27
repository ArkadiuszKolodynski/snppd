import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { ScheduleSnapsPruneCommand } from '../../../src/app/snap/commands/impl/schedule-snaps-prune.command';
import { SnapService } from '../../../src/app/snap/snap.service';

const SnapServiceUnitSuite = suite<{ commandBus: CommandBus; queryBus: QueryBus; service: SnapService }>(
  'SnapService - unit'
);

SnapServiceUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [CommandBus, QueryBus, SnapService],
  })
    .overrideProvider(CommandBus)
    .useValue({ execute: () => null })
    .overrideProvider(QueryBus)
    .useValue({ execute: () => null })
    .compile();

  context.commandBus = module.get(CommandBus);
  context.queryBus = module.get(QueryBus);
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

SnapServiceUnitSuite.run();
