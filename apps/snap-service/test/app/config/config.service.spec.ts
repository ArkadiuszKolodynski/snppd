import { ConfigService as NestConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { ConfigService } from '../../../src/app/config/config.service';

const ConfigServiceSuite = suite<{
  service: ConfigService;
  nestConfigService: NestConfigService;
  stub: sinon.SinonStub;
}>('ConfigServiceSuite');

ConfigServiceSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [ConfigService, NestConfigService],
  }).compile();

  context.service = module.get(ConfigService);
  context.nestConfigService = module.get(NestConfigService);
});

ConfigServiceSuite.before.each((context) => {
  sinon.restore();
  context.stub = sinon.stub(context.nestConfigService, 'get');
});

ConfigServiceSuite('should get databaseUrl from nestConfigService', async ({ service, stub }) => {
  service.databaseUrl;

  expect(stub.calledOnceWith('databaseUrl')).to.be.true;
});

ConfigServiceSuite('should get port from nestConfigService', async ({ service, stub }) => {
  service.port;

  expect(stub.calledOnceWith('port')).to.be.true;
});

ConfigServiceSuite('should get pruneSnapsCron from nestConfigService', async ({ service, stub }) => {
  service.pruneSnapsCron;

  expect(stub.calledOnceWith('pruneSnapsCron')).to.be.true;
});

ConfigServiceSuite('should get pruneSnapsDelayInDays from nestConfigService', async ({ service, stub }) => {
  service.pruneSnapsDelayInDays;

  expect(stub.calledOnceWith('pruneSnapsDelayInDays')).to.be.true;
});

ConfigServiceSuite('should get redisHost from nestConfigService', async ({ service, stub }) => {
  service.redisHost;

  expect(stub.calledOnceWith('redisHost')).to.be.true;
});

ConfigServiceSuite('should get redisPort from nestConfigService', async ({ service, stub }) => {
  service.redisPort;

  expect(stub.calledOnceWith('redisPort')).to.be.true;
});

ConfigServiceSuite('should get swagger config', async ({ service }) => {
  const config = service.swaggerConfig;

  expect(config).to.exist.and.to.have.property('openapi').and.to.be.a('string');
});

ConfigServiceSuite.run();
