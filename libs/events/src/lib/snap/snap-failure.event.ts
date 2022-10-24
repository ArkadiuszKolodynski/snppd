import { IEvent } from '@nestjs/cqrs';
import { FailedSnap } from '@snppd/common';

export class SnapFailureEvent implements IEvent {
  constructor(public readonly failedSnap: FailedSnap) {}
}
