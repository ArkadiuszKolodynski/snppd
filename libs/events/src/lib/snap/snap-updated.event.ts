import { IEvent } from '@nestjs/cqrs';
import { Snap } from '@prisma/client';

export class SnapUpdatedEvent implements IEvent {
  constructor(public readonly updatedSnap: Snap) {}
}
