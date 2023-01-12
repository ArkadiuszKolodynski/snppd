import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SnapCreatedEvent } from '@snppd/events';
import { WebSocketService } from '@snppd/websockets';

@EventsHandler(SnapCreatedEvent)
export class SnapCreatedHandler implements IEventHandler<SnapCreatedEvent> {
  constructor(private readonly websocketService: WebSocketService) {}

  handle(event: SnapCreatedEvent) {
    // TODO: emit event only to the user that requested snap generation
    this.websocketService.emit(SnapCreatedEvent.name, event.createdSnap);
  }
}
