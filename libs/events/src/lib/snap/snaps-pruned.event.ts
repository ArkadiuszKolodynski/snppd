import { IEvent } from '@nestjs/cqrs';

export class SnapsPrunedEvent implements IEvent {
  constructor(public readonly snapIds: string[]) {}
}
