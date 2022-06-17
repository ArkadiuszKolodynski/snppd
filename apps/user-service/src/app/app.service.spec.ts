import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';

import { AppService } from './app.service';

const AppServiceSuite = suite<{ service: AppService }>('AppServiceSuite');

AppServiceSuite.before(async (context) => {
  const app = await Test.createTestingModule({
    providers: [AppService],
  }).compile();

  context.service = app.get<AppService>(AppService);
});

AppServiceSuite('should return "Welcome to user-service!"', ({ service }) => {
  equal(service.getData().message, 'Welcome to user-service!');
});
AppServiceSuite.run();
