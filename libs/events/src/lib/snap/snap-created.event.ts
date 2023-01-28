import { IEvent } from '@nestjs/cqrs';
import { Snap } from '@prisma-snap/client';

export class SnapCreatedEvent implements IEvent {
  constructor(public readonly createdSnap: Snap) {}
}
