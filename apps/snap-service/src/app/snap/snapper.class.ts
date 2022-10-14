import { Injectable } from '@nestjs/common';
import { convert } from 'html-to-text';
import * as puppeteer from 'puppeteer';

@Injectable()
export class Snapper {
  async generateSnap(
    url: string
  ): Promise<{ imageBuffer: Buffer; title: string; htmlContent: string; textContent: string }> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const imageBuffer = (await page.screenshot({ fullPage: true, omitBackground: true })) as Buffer;
    const title = await page.title();
    const htmlContent = await page.content();
    const textContent = await this.convertHtmlToText(htmlContent);
    await browser.close();
    return { imageBuffer, title, htmlContent, textContent };
  }

  private convertHtmlToText(htmlContent: string): Promise<string> {
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
