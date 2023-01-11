import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { SnapCreatedEvent, SnapFailureEvent, SnapGeneratedEvent } from '@snppd/events';
import { map, Observable } from 'rxjs';
import { CreateSnapCommand } from '../commands/impl/create-snap.command';

@Injectable()
export class SnapSagas {
  @Saga()
  snapGenerated(events$: Observable<IEvent>): Observable<ICommand> {
    return events$.pipe(
      ofType(SnapGeneratedEvent),
      map((event) => new CreateSnapCommand(event.generatedSnap))
    );
  }

  // TODO: handle snap created - send info to the user via websockets
  @Saga()
  snapCreated(events$: Observable<IEvent>): Observable<ICommand> {
    return events$.pipe(
      ofType(SnapCreatedEvent),
      map(() => null)
    );
  }

  // TODO: handle snap failure - send info to the user via websockets
  @Saga()
  snapFailure(events$: Observable<IEvent>): Observable<null> {
    return events$.pipe(
      ofType(SnapFailureEvent),
      map(() => null)
    );
  }
}
