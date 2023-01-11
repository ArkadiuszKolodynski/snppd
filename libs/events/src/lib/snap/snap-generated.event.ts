import { IEvent } from '@nestjs/cqrs';
import { GeneratedSnap } from '@snppd/shared';

export class SnapGeneratedEvent implements IEvent {
  constructor(public readonly generatedSnap: GeneratedSnap) {}
}
