import { PageOptionsDto } from '@snppd/shared';

export class FindSnapsQuery {
  constructor(public readonly pageOptionsDto: PageOptionsDto, public readonly userId: string) {}
}
