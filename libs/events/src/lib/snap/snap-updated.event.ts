import { IEvent } from '@nestjs/cqrs';
import { Snap } from '@prisma-snap/client';

export class SnapUpdatedEvent implements IEvent {
  constructor(public readonly updatedSnap: Snap) {}
}
