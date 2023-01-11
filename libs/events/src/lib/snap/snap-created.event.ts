import { IEvent } from '@nestjs/cqrs';
import { Snap } from '@prisma/client';

export class SnapCreatedEvent implements IEvent {
  constructor(public readonly createdSnap: Snap) {}
}
