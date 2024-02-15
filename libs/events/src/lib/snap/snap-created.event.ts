import { IEvent } from '@nestjs/cqrs';
import { ISnap } from '@snppd/shared';

export class SnapCreatedEvent implements IEvent {
  constructor(public readonly createdSnap: ISnap) {}
}
