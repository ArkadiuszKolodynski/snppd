import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { instance } from 'uvu/assert';

import { SnapController } from './snap.controller';
import { SnapService } from './snap.service';

const SnapControllerSuite = suite<{ controller: SnapController }>('SnapControllerSuite');

SnapControllerSuite.before(async (context) => {
  const app = await Test.createTestingModule({
    controllers: [SnapController],
    providers: [SnapService],
  }).compile();

  context.controller = app.get(SnapController);
});

SnapControllerSuite('controller should be an instance of SnapController', ({ controller }) => {
  instance(controller, SnapController);
});
SnapControllerSuite.run();
