import { faker } from '@faker-js/faker';
import { getQueueToken } from '@nestjs/bull';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { PageOptionsDto, ParamsValidationTest } from '@snppd/shared';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { suite } from 'uvu';
import { AppModule } from '../../../src/app/app.module';
import { SNAP_QUEUE_NAME } from '../../../src/app/constants';
import { PrismaService } from '../../../src/app/prisma/prisma.service';
import { DeleteSnapCommand } from '../../../src/app/snap/commands/impl/delete-snap.command';
import { EnqueueSnapGenerationCommand } from '../../../src/app/snap/commands/impl/enqueue-snap-generation.command';
import { UpdateSnapCommand } from '../../../src/app/snap/commands/impl/update-snap.command';
import { GenerateSnapDto } from '../../../src/app/snap/dto';
import { UpdateSnapDto } from '../../../src/app/snap/dto/update-snap.dto';
import { FindSnapByIdQuery } from '../../../src/app/snap/queries/impl/find-snap-by-id.command';
import { FindSnapsQuery } from '../../../src/app/snap/queries/impl/find-snaps.command';
import { SnapController } from '../../../src/app/snap/snap.controller';

const SnapControllerE2eSuite = suite<{
  app: INestApplication;
  controller: SnapController;
  endpoint: string;
}>('SnapController - e2e');

SnapControllerE2eSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(CommandBus)
    .useValue({ execute: () => null, register: () => null })
    .overrideProvider(QueryBus)
    .useValue({ execute: () => null, register: () => null })
    .overrideProvider(getQueueToken(SNAP_QUEUE_NAME))
    .useValue({ add: sinon.fake(), process: sinon.fake(), on: sinon.fake() })
    .overrideProvider(PrismaService)
    .useValue({})
    .compile();

  context.endpoint = '/snaps';
  context.controller = module.get(SnapController);
  context.app = module.createNestApplication();
  await context.app.init();
});

SnapControllerE2eSuite.after(async ({ app }) => {
  await app.close();
});

const findManyParams = new PageOptionsDto();

const generateParams: GenerateSnapDto = {
  url: faker.internet.url(),
  tags: [faker.random.word(), faker.random.word()],
};

const updateParams: UpdateSnapDto = {
  tags: [faker.random.word(), faker.random.word()],
};

const findManyValidationTests: ParamsValidationTest<PageOptionsDto>[] = [
  { params: { ...findManyParams, order: 'not an enum' }, testDescription: 'is not an enum', testedVariable: 'order' },
  { params: { ...findManyParams, page: 'not a number' }, testDescription: 'is not a number', testedVariable: 'page' },
  { params: { ...findManyParams, page: 0 }, testDescription: 'is below the minimum', testedVariable: 'page' },
  { params: { ...findManyParams, take: 'not a number' }, testDescription: 'is not a number', testedVariable: 'take' },
  { params: { ...findManyParams, take: 0 }, testDescription: 'is below the minimum', testedVariable: 'take' },
  { params: { ...findManyParams, take: 51 }, testDescription: 'is above maximum', testedVariable: 'take' },
];

findManyValidationTests.forEach((validationTest) => {
  SnapControllerE2eSuite(
    `#findMany should return 400 Bad Request when ${validationTest.testedVariable} ${validationTest.testDescription}`,
    async ({ app, endpoint }) => {
      const response = await request(app.getHttpServer())
        .get(endpoint)
        .query(validationTest.params)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).to.exist;
    }
  );
});

const generateValidationTests: ParamsValidationTest<GenerateSnapDto>[] = [
  { params: { ...generateParams, url: undefined }, testDescription: 'is undefined', testedVariable: 'url' },
  { params: { ...generateParams, url: '' }, testDescription: 'is empty', testedVariable: 'url' },
  { params: { ...generateParams, url: 'not an URL' }, testDescription: 'is not an URL', testedVariable: 'url' },
  {
    params: { ...generateParams, tags: 'not an string array' },
    testDescription: 'is not an string array',
    testedVariable: 'tags',
  },
  { params: { ...generateParams, tags: [''] }, testDescription: 'has an empty string', testedVariable: 'tags' },
  {
    params: { ...generateParams, tags: [faker.random.alphaNumeric(256)] },
    testDescription: 'has elements longer than 255 chars',
    testedVariable: 'tags',
  },
  {
    params: { ...generateParams, tags: ['not-unique', 'not-unique'] },
    testDescription: 'has non unique elements',
    testedVariable: 'tags',
  },
];

generateValidationTests.forEach((validationTest) => {
  SnapControllerE2eSuite(
    `#generate should return 400 Bad Request when ${validationTest.testedVariable} ${validationTest.testDescription}`,
    async ({ app, endpoint }) => {
      const response = await request(app.getHttpServer())
        .post(`${endpoint}/generate`)
        .send(validationTest.params)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).to.exist;
    }
  );
});

const updateValidationTests: ParamsValidationTest<UpdateSnapDto>[] = [
  { params: { ...updateParams, tags: [''] }, testDescription: 'has an empty string', testedVariable: 'tags' },
  {
    params: { ...updateParams, tags: [faker.random.alphaNumeric(256)] },
    testDescription: 'has elements longer than 255 chars',
    testedVariable: 'tags',
  },
  {
    params: { ...updateParams, tags: ['not-unique', 'not-unique'] },
    testDescription: 'has non unique elements',
    testedVariable: 'tags',
  },
];

updateValidationTests.forEach((validationTest) => {
  SnapControllerE2eSuite(
    `#generate should return 400 Bad Request when ${validationTest.testedVariable} ${validationTest.testDescription}`,
    async ({ app, endpoint }) => {
      const id = faker.datatype.uuid();
      const response = await request(app.getHttpServer())
        .patch(`${endpoint}/${id}`)
        .send(validationTest.params)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).to.exist;
    }
  );
});

SnapControllerE2eSuite(`#findMany should return 200 OK when valid query is passed`, async ({ app, endpoint }) => {
  await request(app.getHttpServer()).get(endpoint).query(findManyParams).expect(HttpStatus.OK);
});

SnapControllerE2eSuite(
  `#findById should return 400 Bad Request when invalid UUID is passed`,
  async ({ app, endpoint }) => {
    const id = 'not-a-valid-uuid';
    await request(app.getHttpServer()).get(`${endpoint}/${id}`).send().expect(HttpStatus.BAD_REQUEST);
  }
);

SnapControllerE2eSuite(`#findById should return 200 OK when valid UUID is passed`, async ({ app, endpoint }) => {
  const id = faker.datatype.uuid();
  await request(app.getHttpServer()).get(`${endpoint}/${id}`).send().expect(HttpStatus.OK);
});

SnapControllerE2eSuite(
  `#generate should return 204 No Content when valid request body is passed`,
  async ({ app, endpoint }) => {
    await request(app.getHttpServer()).post(`${endpoint}/generate`).send(generateParams).expect(HttpStatus.NO_CONTENT);
  }
);

SnapControllerE2eSuite(
  `#update should return 400 Bad Request when invalid UUID is passed`,
  async ({ app, endpoint }) => {
    const id = 'not-a-valid-uuid';
    await request(app.getHttpServer()).patch(`${endpoint}/${id}`).send().expect(HttpStatus.BAD_REQUEST);
  }
);

SnapControllerE2eSuite(`#update should return 200 OK when valid request body is passed`, async ({ app, endpoint }) => {
  const id = faker.datatype.uuid();
  await request(app.getHttpServer()).patch(`${endpoint}/${id}`).send(generateParams).expect(HttpStatus.OK);
});

SnapControllerE2eSuite(
  `#delete should return 400 Bad Request when invalid UUID is passed`,
  async ({ app, endpoint }) => {
    const id = 'not-a-valid-uuid';
    await request(app.getHttpServer()).delete(`${endpoint}/${id}`).send().expect(HttpStatus.BAD_REQUEST);
  }
);

SnapControllerE2eSuite(`#delete should return 200 OK when valid UUID is passed`, async ({ app, endpoint }) => {
  const id = faker.datatype.uuid();
  await request(app.getHttpServer()).delete(`${endpoint}/${id}`).send().expect(HttpStatus.OK);
});

const SnapControllerUnitSuite = suite<{ controller: SnapController; commandBus: CommandBus; queryBus: QueryBus }>(
  'SnapController - unit'
);

SnapControllerUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    controllers: [SnapController],
    providers: [CommandBus, QueryBus],
  })
    .overrideProvider(CommandBus)
    .useValue({ execute: () => null })
    .overrideProvider(QueryBus)
    .useValue({ execute: () => null })
    .compile();

  context.controller = module.get(SnapController);
  context.commandBus = module.get(CommandBus);
  context.queryBus = module.get(QueryBus);
});

SnapControllerUnitSuite.after.each(() => {
  sinon.restore();
});

SnapControllerUnitSuite('#findMany should call SnapService.findMany method', async ({ controller, queryBus }) => {
  const spy = sinon.spy(queryBus, 'execute');
  const pageOptionsDto = new PageOptionsDto();
  const userId = faker.datatype.uuid();
  sinon.stub(faker.datatype, 'uuid').returns(userId);

  await controller.findMany(pageOptionsDto);

  expect(spy.calledOnceWithExactly(new FindSnapsQuery(pageOptionsDto, userId))).to.be.true;
});

SnapControllerUnitSuite('#findById should call SnapService.findById method', async ({ controller, queryBus }) => {
  const spy = sinon.spy(queryBus, 'execute');
  const id = faker.datatype.uuid();
  const userId = faker.datatype.uuid();
  sinon.stub(faker.datatype, 'uuid').returns(userId);

  await controller.findById(id);

  expect(spy.calledOnceWithExactly(new FindSnapByIdQuery(id, userId))).to.be.true;
});

SnapControllerUnitSuite('#generate should call SnapService.generate method', async ({ controller, commandBus }) => {
  const spy = sinon.spy(commandBus, 'execute');
  const generateSnapDto: GenerateSnapDto = {
    url: faker.internet.url(),
    tags: [faker.random.word(), faker.random.word()],
  };
  const userId = faker.datatype.uuid();
  sinon.stub(faker.datatype, 'uuid').returns(userId);

  await controller.generate(generateSnapDto);

  expect(spy.calledOnceWithExactly(new EnqueueSnapGenerationCommand(generateSnapDto, userId))).to.be.true;
});

SnapControllerUnitSuite('#update should call SnapService.generate method', async ({ controller, commandBus }) => {
  const spy = sinon.spy(commandBus, 'execute');
  const id = faker.datatype.uuid();
  const updateSnapDto: UpdateSnapDto = {
    tags: [faker.random.word(), faker.random.word()],
  };
  const userId = faker.datatype.uuid();
  sinon.stub(faker.datatype, 'uuid').returns(userId);

  await controller.update(id, updateSnapDto);

  expect(spy.calledOnceWithExactly(new UpdateSnapCommand(id, updateSnapDto, userId))).to.be.true;
});

SnapControllerUnitSuite('#delete should call SnapService.delete method', async ({ controller, commandBus }) => {
  const spy = sinon.spy(commandBus, 'execute');
  const id = faker.datatype.uuid();
  const userId = faker.datatype.uuid();
  sinon.stub(faker.datatype, 'uuid').returns(userId);

  await controller.delete(id);

  expect(spy.calledOnceWithExactly(new DeleteSnapCommand(id, userId))).to.be.true;
});

SnapControllerE2eSuite.run();
SnapControllerUnitSuite.run();
