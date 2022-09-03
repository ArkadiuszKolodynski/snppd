import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { instance } from 'uvu/assert';
import { PrismaService } from './prisma.service';

const PrimsaServiceSuite = suite<{ service: PrismaService }>('PrismaServiceSuite');

PrimsaServiceSuite.before(async (context) => {
  const app = await Test.createTestingModule({
    providers: [PrismaService],
  }).compile();

  context.service = app.get<PrismaService>(PrismaService);
});

PrimsaServiceSuite('service should be an instance of PrismaService', ({ service }) => {
  instance(service, PrismaService);
});
PrimsaServiceSuite.run();