import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ParamsValidationTest } from '@snppd/shared';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { suite } from 'uvu';
import { AppModule } from '../../../src/app/app.module';
import { GenerateSnapDto } from '../../../src/app/snap/dto';
import { UpdateSnapDto } from '../../../src/app/snap/dto/update-snap.dto';
import { SnapController } from '../../../src/app/snap/snap.controller';
import { SnapService } from '../../../src/app/snap/snap.service';
import { SnapServiceMock } from './snap.service.mock';

const SnapControllerE2eSuite = suite<{
  app: INestApplication;
  controller: SnapController;
  generateEndpoint: string;
  updateEndpoint: (id: string) => string;
  deleteEndpoint: (id: string) => string;
}>('SnapController - e2e');

SnapControllerE2eSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(SnapService)
    .useClass(SnapServiceMock)
    .compile();

  const baseEndpoint = '/snaps';
  context.controller = module.get(SnapController);
  context.generateEndpoint = `${baseEndpoint}/generate`;
  context.updateEndpoint = (id: string) => `${baseEndpoint}/${id}`;
  context.deleteEndpoint = (id: string) => `${baseEndpoint}/${id}`;

  context.app = module.createNestApplication();
  await context.app.init();
});

SnapControllerE2eSuite.after(async ({ app }) => {
  await app.close();
});

const generateParams: GenerateSnapDto = {
  url: faker.internet.url(),
  tags: [faker.random.word(), faker.random.word()],
};

const updateParams: UpdateSnapDto = {
  tags: [faker.random.word(), faker.random.word()],
};

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

const updateValidationTests: ParamsValidationTest<UpdateSnapDto>[] = [
  { params: { tags: [''] }, testDescription: 'has an empty string', testedVariable: 'tags' },
  {
    params: { tags: [faker.random.alphaNumeric(256)] },
    testDescription: 'has elements longer than 255 chars',
    testedVariable: 'tags',
  },
  {
    params: { tags: ['not-unique', 'not-unique'] },
    testDescription: 'has non unique elements',
    testedVariable: 'tags',
  },
];

generateValidationTests.forEach((validationTest) => {
  SnapControllerE2eSuite(
    `#generate should return 400 Bad Request when ${validationTest.testedVariable} ${validationTest.testDescription}`,
    async ({ app, generateEndpoint }) => {
      const response = await request(app.getHttpServer())
        .post(generateEndpoint)
        .send(validationTest.params)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).to.exist;
    }
  );
});

updateValidationTests.forEach((validationTest) => {
  SnapControllerE2eSuite(
    `#generate should return 400 Bad Request when ${validationTest.testedVariable} ${validationTest.testDescription}`,
    async ({ app, updateEndpoint }) => {
      const id = faker.datatype.uuid();
      const response = await request(app.getHttpServer())
        .patch(updateEndpoint(id))
        .send(validationTest.params)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).to.exist;
    }
  );
});

SnapControllerE2eSuite(
  `#generate should return 204 No Content when valid request body is passed`,
  async ({ app, generateEndpoint }) => {
    await request(app.getHttpServer()).post(generateEndpoint).send(generateParams).expect(HttpStatus.NO_CONTENT);
  }
);

SnapControllerE2eSuite(
  `#updated should return 400 Bad Request when invalid UUID is passed`,
  async ({ app, updateEndpoint }) => {
    const id = 'not-a-valid-uuid';
    await request(app.getHttpServer()).patch(updateEndpoint(id)).send().expect(HttpStatus.BAD_REQUEST);
  }
);

SnapControllerE2eSuite(
  `#update should return 200 OK when valid request body is passed`,
  async ({ app, updateEndpoint }) => {
    const id = faker.datatype.uuid();
    await request(app.getHttpServer()).patch(updateEndpoint(id)).send(generateParams).expect(HttpStatus.OK);
  }
);

SnapControllerE2eSuite(
  `#delete should return 400 Bad Request when invalid UUID is passed`,
  async ({ app, deleteEndpoint }) => {
    const id = 'not-a-valid-uuid';
    await request(app.getHttpServer()).delete(deleteEndpoint(id)).send().expect(HttpStatus.BAD_REQUEST);
  }
);

SnapControllerE2eSuite(`#delete should return 200 OK when valid UUID is passrd`, async ({ app, deleteEndpoint }) => {
  const id = faker.datatype.uuid();
  await request(app.getHttpServer()).delete(deleteEndpoint(id)).send().expect(HttpStatus.OK);
});

const SnapControllerUnitSuite = suite<{ controller: SnapController; service: SnapService }>('SnapController - unit');

SnapControllerUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    controllers: [SnapController],
    providers: [SnapService],
  })
    .overrideProvider(SnapService)
    .useClass(SnapServiceMock)
    .compile();

  context.controller = module.get(SnapController);
  context.service = module.get(SnapService);
});

SnapControllerUnitSuite.after.each(() => {
  sinon.restore();
});

SnapControllerUnitSuite('#generate should call SnapService.generate method', async ({ controller, service }) => {
  const spy = sinon.spy(service, 'generate');

  await controller.generate(generateParams);

  expect(spy.calledOnceWithExactly(generateParams, sinon.match.string)).to.be.true;
});

SnapControllerUnitSuite('#update should call SnapService.generate method', async ({ controller, service }) => {
  const spy = sinon.spy(service, 'update');

  const id = faker.datatype.uuid();
  await controller.update(id, updateParams);

  expect(spy.calledOnceWithExactly(id, updateParams, sinon.match.string)).to.be.true;
});

SnapControllerUnitSuite('#delete should call SnapService.delete method', async ({ controller, service }) => {
  const spy = sinon.spy(service, 'delete');

  const id = faker.datatype.uuid();
  await controller.delete(id);

  expect(spy.calledOnceWithExactly(id, sinon.match.string)).to.be.true;
});

SnapControllerE2eSuite.run();
SnapControllerUnitSuite.run();
