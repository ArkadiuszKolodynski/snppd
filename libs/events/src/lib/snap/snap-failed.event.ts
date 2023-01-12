import { IEvent } from '@nestjs/cqrs';
import { FailedSnap } from '@snppd/shared';

export class SnapFailedEvent implements IEvent {
  constructor(public readonly failedSnap: FailedSnap) {}
}
