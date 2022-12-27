import { IEvent } from '@nestjs/cqrs';
import { GeneratedSnap } from '@snppd/common';

export class SnapGeneratedEvent implements IEvent {
  constructor(public readonly data: GeneratedSnap) {}
}
