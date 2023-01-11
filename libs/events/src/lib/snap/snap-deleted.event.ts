import { IEvent } from '@nestjs/cqrs';

export class SnapDeletedEvent implements IEvent {
  constructor(public readonly snapId: string) {}
}
