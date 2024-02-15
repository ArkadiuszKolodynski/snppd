import { AggregateRoot } from '@nestjs/cqrs';
import { ISnap } from '@snppd/shared';

export class Snap extends AggregateRoot implements ISnap {
  constructor(
    readonly id: string,
    readonly url: string,
    readonly userId: string,
    readonly tags: string[],
    readonly title: string,
    readonly screenshotUrl: string,
    readonly headlineImageUrl: string,
    readonly author?: string,
    readonly content?: string,
    readonly excerpt?: string,
    readonly length?: number,
    readonly lang?: string
  ) {
    super();
  }
}
