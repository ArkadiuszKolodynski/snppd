import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { GenerateSnapDto } from '../dto';
import { SnapService } from '../snap.service';

const generateSnapSuite = suite<{ app: INestApplication; commandBus: CommandBus; service: SnapService }>(
  'Generate Snap'
);

generateSnapSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [
      SnapService,
      {
        provide: CommandBus,
        useValue: {
          execute: async () => {
            return;
          },
        },
      },
    ],
  }).compile();

  context.commandBus = module.get(CommandBus);
  context.service = module.get(SnapService);
});

generateSnapSuite.after.each(() => {
  sinon.restore();
});

generateSnapSuite('should call CommandBus.execute method', async ({ commandBus, service }) => {
  const spy = sinon.spy(commandBus, 'execute');
  const generateSnapDto: GenerateSnapDto = { name: faker.random.words(3), url: faker.internet.url() };
  await service.generate(generateSnapDto);
  sinon.assert.calledOnce(spy);
});

generateSnapSuite.run();
