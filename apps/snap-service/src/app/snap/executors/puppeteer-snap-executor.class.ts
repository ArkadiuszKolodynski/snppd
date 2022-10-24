import { Injectable, Logger } from '@nestjs/common';
import { convert } from 'html-to-text';
import * as puppeteer from 'puppeteer';
import { SnapExecutor } from './snap-executor.interface';

@Injectable()
export class PuppeteerSnapExecutor implements SnapExecutor {
  // TODO: provide custom logger
  private readonly logger = new Logger(PuppeteerSnapExecutor.name);

  async generateSnap(
    url: string
  ): Promise<{ imageBuffer: Buffer; title: string; htmlContent: string; textContent: string } | null> {
    let browser: puppeteer.Browser;
    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      const imageBuffer = (await page.screenshot({ fullPage: true, omitBackground: true })) as Buffer;
      const title = await page.title();
      const htmlContent = await page.content();
      const textContent = await this.convertHtmlToText(htmlContent);
      return { imageBuffer, title, htmlContent, textContent };
    } catch (err) {
      this.logger.error(err.message, err.stack);
      return null;
    } /* c8 ignore next */ finally {
      await browser.close();
    }
  }

  public convertHtmlToText(htmlContent: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const textContent = convert(htmlContent);
        resolve(textContent);
      } catch (err) {
        reject(err);
      }
    });
  }
}
