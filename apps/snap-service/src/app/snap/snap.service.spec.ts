import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { instance } from 'uvu/assert';
import { SnapService } from './snap.service';

const SnapServiceSuite = suite<{ service: SnapService }>('SnapServiceSuite');

SnapServiceSuite.before(async (context) => {
  const app = await Test.createTestingModule({
    providers: [SnapService],
  }).compile();

  context.service = app.get(SnapService);
});

SnapServiceSuite('service should be an instance of SnapService', ({ service }) => {
  instance(service, SnapService);
});
SnapServiceSuite.run();
