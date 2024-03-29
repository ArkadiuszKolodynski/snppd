import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { Logger, LoggerMock } from '@snppd/logger';
import { expect } from 'chai';
import * as puppeteer from 'puppeteer';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import { PuppeteerSnapExecutor } from '../../../../src/app/snap/executors';

const PuppeteerSnapExecutorUnitSuite = suite<{
  snapExecutor: PuppeteerSnapExecutor;
  puppeteerStub: { launch: sinon.SinonStub };
  browserStub: { newPage: sinon.SinonStub; close: sinon.SinonStub };
  pageStub: { content: sinon.SinonStub; goto: sinon.SinonStub; screenshot: sinon.SinonStub; title: sinon.SinonStub };
}>('PuppeteerSnapExecutor - unit');

PuppeteerSnapExecutorUnitSuite.before(async (context) => {
  const module = await Test.createTestingModule({
    providers: [PuppeteerSnapExecutor, Logger],
  })
    .overrideProvider(Logger)
    .useClass(LoggerMock)
    .compile();

  context.snapExecutor = module.get(PuppeteerSnapExecutor);
});

PuppeteerSnapExecutorUnitSuite.before.each((context) => {
  context.pageStub = { content: sinon.stub(), goto: sinon.stub(), screenshot: sinon.stub(), title: sinon.stub() };
  context.browserStub = { newPage: sinon.stub().resolves(context.pageStub), close: sinon.stub() };
  context.puppeteerStub = sinon.stub(puppeteer);
  context.puppeteerStub.launch.resolves(context.browserStub as unknown as puppeteer.Browser);
  sinon.stub(context.snapExecutor['logger']);
});

PuppeteerSnapExecutorUnitSuite.after.each(() => {
  sinon.restore();
});

PuppeteerSnapExecutorUnitSuite('should launch browser', async ({ snapExecutor, puppeteerStub }) => {
  const url = faker.internet.url();

  await snapExecutor.generateSnap(url);

  expect(puppeteerStub.launch.calledOnce).to.be.true;
});

PuppeteerSnapExecutorUnitSuite('should open new page in the browser', async ({ snapExecutor, browserStub }) => {
  const url = faker.internet.url();

  await snapExecutor.generateSnap(url);

  expect(browserStub.newPage.calledOnce).to.be.true;
});

PuppeteerSnapExecutorUnitSuite('should navigate to the provided URL', async ({ snapExecutor, pageStub }) => {
  const url = faker.internet.url();

  await snapExecutor.generateSnap(url);

  expect(pageStub.goto.calledOnceWithExactly(url)).to.be.true;
});

PuppeteerSnapExecutorUnitSuite('should take the screenshot of the page', async ({ snapExecutor, pageStub }) => {
  const url = faker.internet.url();

  await snapExecutor.generateSnap(url);

  expect(pageStub.screenshot.calledOnce).to.be.true;
});

PuppeteerSnapExecutorUnitSuite(
  'should return null and close the browser if there was an error',
  async ({ snapExecutor, browserStub }) => {
    const url = faker.internet.url();
    sinon.stub(Promise, 'all').throws();

    const result = await snapExecutor.generateSnap(url);

    expect(result).to.be.null;
    expect(browserStub.close.calledOnce).to.be.true;
  }
);

PuppeteerSnapExecutorUnitSuite('should return snap and close the browser', async ({ snapExecutor, browserStub }) => {
  const url = faker.internet.url();

  const result = await snapExecutor.generateSnap(url);

  expect(result).to.exist;
  expect(browserStub.close.calledOnce).to.be.true;
});

PuppeteerSnapExecutorUnitSuite.run();
