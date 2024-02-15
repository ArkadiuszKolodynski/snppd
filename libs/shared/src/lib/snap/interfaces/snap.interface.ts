import { IdentifiableObject } from '../../interfaces';

export interface ISnap extends IdentifiableObject {
  readonly userId: string;
  readonly url: string;
  readonly tags: string[];
  readonly title: string;
  readonly screenshotUrl: string;
  readonly headlineImageUrl: string;
  readonly author?: string;
  readonly content?: string;
  readonly excerpt?: string;
  readonly length?: number;
  readonly lang?: string;
}
