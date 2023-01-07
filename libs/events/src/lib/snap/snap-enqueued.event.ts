import { IEvent } from '@nestjs/cqrs';

export class SnapEnqueuedEvent implements IEvent {
  constructor(public readonly url: string, public readonly userId: string) {}
}
