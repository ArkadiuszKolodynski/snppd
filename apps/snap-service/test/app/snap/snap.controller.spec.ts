import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ParamsValidationTest } from '@snppd/common';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { suite } from 'uvu';
import { AppModule } from '../../../src/app/app.module';
import { GenerateSnapDto } from '../../../src/app/snap/dto';
import { SnapController } from '../../../src/app/snap/snap.controller';
import { SnapService } from '../../../src/app/snap/snap.service';
import { SnapServiceMock } from './snap-service.mock';

const generateSnapE2eSuite = suite<{ app: INestApplication; controller: SnapController; endpoint: string }>(
  'Generate Snap - e2e'
);

generateSnapE2eSuite.before(async (context) => {
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

generateSnapE2eSuite.after(async ({ app }) => {
  await app.close();
});

const validParams: GenerateSnapDto = { name: faker.word.verb(5), url: faker.internet.url() };

generateSnapE2eSuite(`should return 204 No Content when valid request body is passed`, async ({ app, endpoint }) => {
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

validationTests.forEach((validationTest) => {
  generateSnapE2eSuite(
    `should return 400 Bad Request when ${validationTest.testedVariable} ${validationTest.testDescription}`,
    async ({ app, endpoint }) => {
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(validationTest.params)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).to.exist;
    }
  );
});

const generateSnapUnitSuite = suite<{ app: INestApplication; controller: SnapController; service: SnapService }>(
  'Generate Snap - unit'
);

generateSnapUnitSuite.before(async (context) => {
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

generateSnapUnitSuite.after.each(() => {
  sinon.restore();
});

generateSnapUnitSuite('should call SnapService.execute method', async ({ controller, service }) => {
  const spy = sinon.spy(service, 'generate');
  const generateSnapDto: GenerateSnapDto = { name: faker.random.words(3), url: faker.internet.url() };

  await controller.generate(generateSnapDto);

  expect(spy.calledOnceWithExactly(generateSnapDto)).to.be.true;
});

generateSnapE2eSuite.run();
generateSnapUnitSuite.run();
