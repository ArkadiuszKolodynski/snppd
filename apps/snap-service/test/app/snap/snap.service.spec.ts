import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { GenerateSnapCommand } from '../../../src/app/snap/commands/impl/generate-snap.command';
import { GenerateSnapDto } from '../../../src/app/snap/dto';
import { SnapService } from '../../../src/app/snap/snap.service';

const generateSnapUnitSuite = suite<{ app: INestApplication; commandBus: CommandBus; service: SnapService }>(
  'Generate Snap - unit'
);

generateSnapUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [
      SnapService,
      {
        provide: CommandBus,
        useValue: {
          execute: async () => null,
        },
      },
    ],
  }).compile();

  context.commandBus = module.get(CommandBus);
  context.service = module.get(SnapService);
});

generateSnapUnitSuite.after.each(() => {
  sinon.restore();
});

generateSnapUnitSuite('should call CommandBus.execute method', async ({ commandBus, service }) => {
  const spy = sinon.spy(commandBus, 'execute');
  const generateSnapDto: GenerateSnapDto = { name: faker.random.words(3), url: faker.internet.url() };

  await service.generate(generateSnapDto);

  expect(spy.calledOnceWithExactly(new GenerateSnapCommand(generateSnapDto.name, generateSnapDto.url))).to.be.true;
});

generateSnapUnitSuite.run();
