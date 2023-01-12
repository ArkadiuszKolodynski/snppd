import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SnapFailedEvent } from '@snppd/events';
import { WebSocketService } from '@snppd/websockets';

@EventsHandler(SnapFailedEvent)
export class SnapFailedHandler implements IEventHandler<SnapFailedEvent> {
  constructor(private readonly websocketService: WebSocketService) {}

  handle(event: SnapFailedEvent) {
    // TODO: emit event only to the user that requested snap generation
    this.websocketService.emit(SnapFailedEvent.name, event.failedSnap);
  }
}
