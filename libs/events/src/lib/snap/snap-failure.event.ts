import { IEvent } from '@nestjs/cqrs';
import { FailedSnap } from '@snppd/shared';

export class SnapFailureEvent implements IEvent {
  constructor(public readonly failedSnap: FailedSnap) {}
}
