import { faker } from '@faker-js/faker';
import { Readability } from '@mozilla/readability';
import { Injectable } from '@nestjs/common';
import { Logger } from '@snppd/logger';
import * as DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import * as puppeteer from 'puppeteer';
import { SnapExecutor, SnapGenerationResult } from './snap-executor.interface';

type Article = {
  title: string;
  byline: string;
  dir: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  siteName: string;
};

// TODO: refactor this class and download all images from article and store them via storage-service
@Injectable()
export class PuppeteerSnapExecutor implements SnapExecutor {
  private readonly purifier: DOMPurify.DOMPurifyI;

  constructor(private readonly logger: Logger) {
    // @ts-expect-error: inconsistent typings between used packages
    this.purifier = DOMPurify(new JSDOM('').window);
    this.purifier.setConfig({ WHOLE_DOCUMENT: true });
  }

  async generateSnap(url: string): Promise<SnapGenerationResult> {
    let browser: puppeteer.Browser;
    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [htmlContent, imageBuffer] = await Promise.all([
        page.content(),
        page.screenshot({ fullPage: true, omitBackground: true }),
      ]);
      const article = this.extractArticle(htmlContent, url);
      const title = article?.title || (await page.title());
      // TODO: replace screenshotUrl with url from storage service
      const screenshotUrl = faker.image.imageUrl();
      return this.getGenerationResult(article, title, screenshotUrl, url);
    } catch (err) {
      this.logger.error(err.message, err.stack);
      return null;
    } /* c8 ignore next */ finally {
      await browser?.close();
    }
  }

  private extractArticle(htmlContent: string, url: string): Article {
    const { document } = new JSDOM(htmlContent, { url }).window;
    const reader = new Readability(document);
    return reader.parse();
  }

  private getGenerationResult(
    article: Article,
    title: string,
    screenshotUrl: string,
    url: string
  ): SnapGenerationResult {
    return {
      author: article?.byline?.trim(),
      content: this.purifier.sanitize(article?.content)?.trim(),
      excerpt: article?.excerpt?.trim(),
      // FIXME: after readability lib types will be fixed
      // lang: article.lang,
      lang: article && article['lang'],
      length: article?.length,
      screenshotUrl,
      snapImageUrl: this.getSnapImage(article?.content) || screenshotUrl,
      title,
      url,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getSnapImage(content: string): string | null {
    // TODO: extract headline image from article
    return null;
  }
}
