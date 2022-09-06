import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ParamsValidationTest } from '@snppd/common';
import * as request from 'supertest';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { AppModule } from '../../app.module';
import { GenerateSnapDto } from '../dto';
import { SnapController } from '../snap.controller';
import { SnapService } from '../snap.service';
import { SnapServiceMock } from './snap-service.mock';

const generateSnapSuite = suite<{ app: INestApplication; controller: SnapController; endpoint: string }>(
  'Generate Snap - e2e'
);

generateSnapSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(SnapService)
    .useClass(SnapServiceMock)
    .compile();

  context.controller = module.get(SnapController);
  context.endpoint = '/snaps/generate';

  context.app = module.createNestApplication();
  await context.app.init();
});

generateSnapSuite.after(async ({ app }) => {
  await app.close();
});

const validParams: GenerateSnapDto = { name: faker.word.verb(5), url: faker.internet.url() };

generateSnapSuite(`should return 204 No Content when valid request body is passed`, async ({ app, endpoint }) => {
  await request(app.getHttpServer()).post(endpoint).send(validParams).expect(HttpStatus.NO_CONTENT);
});

const validationTests: ParamsValidationTest<GenerateSnapDto>[] = [
  { params: { ...validParams, name: undefined }, testDescription: 'is undefined', testedVariable: 'name' },
  {
    params: { ...validParams, name: faker.datatype.number() },
    testDescription: 'is not a string',
    testedVariable: 'name',
  },
  { params: { ...validParams, name: '' }, testDescription: 'is empty', testedVariable: 'name' },
  {
    params: { ...validParams, name: faker.random.alpha(2) },
    testDescription: 'is shorter than 3 chars',
    testedVariable: 'name',
  },
  {
    params: { ...validParams, name: faker.random.alpha(256) },
    testDescription: 'is longer than 255 chars',
    testedVariable: 'name',
  },
  { params: { ...validParams, url: undefined }, testDescription: 'is undefined', testedVariable: 'url' },
  { params: { ...validParams, url: '' }, testDescription: 'is empty', testedVariable: 'url' },
  { params: { ...validParams, url: 'not an URL' }, testDescription: 'is not an URL', testedVariable: 'url' },
];

validationTests.map((validationTest) => {
  generateSnapSuite(
    `should return 400 Bad Request when ${validationTest.testedVariable} ${validationTest.testDescription}`,
    async ({ app, endpoint }) => {
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(validationTest.params)
        .expect(HttpStatus.BAD_REQUEST);

      assert.ok(response.body.message);
    }
  );
});

generateSnapSuite.run();
