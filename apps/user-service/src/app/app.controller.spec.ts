import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const AppControllerSuite = suite<{ controller: AppController }>('AppControllerSuite');

AppControllerSuite.before(async (context) => {
  const app = await Test.createTestingModule({
    controllers: [AppController],
    providers: [AppService],
  }).compile();

  context.controller = app.get<AppController>(AppController);
});

AppControllerSuite('should return "Welcome to user-service!"', ({ controller }) => {
  equal(controller.getData().message, 'Welcome to user-service!');
});
AppControllerSuite.run();
