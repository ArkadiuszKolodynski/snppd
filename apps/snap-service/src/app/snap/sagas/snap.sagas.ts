import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SnapGeneratedEvent } from '@snppd/events';
import { map, Observable } from 'rxjs';
import { Server } from 'socket.io';
import { CreateSnapCommand } from '../commands/impl/create-snap.command';

@WebSocketGateway()
export class SnapSagas {
  @WebSocketServer()
  private readonly server: Server;

  @Saga()
  snapGenerated(events$: Observable<IEvent>): Observable<ICommand> {
    return events$.pipe(
      ofType(SnapGeneratedEvent),
      map((event) => new CreateSnapCommand(event.generatedSnap))
    );
  }
}
