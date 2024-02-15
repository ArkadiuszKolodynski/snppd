import { IEvent } from '@nestjs/cqrs';
import { ISnap } from '@snppd/shared';

export class SnapUpdatedEvent implements IEvent {
  constructor(public readonly updatedSnap: ISnap) {}
}
