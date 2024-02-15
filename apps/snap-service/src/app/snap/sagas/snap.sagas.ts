import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { SnapGeneratedEvent } from '@snppd/events';
import { map, Observable } from 'rxjs';
import { CreateSnapCommand } from '../commands/impl/create-snap.command';

export class SnapSagas {
  @Saga()
  snapGenerated(events$: Observable<IEvent>): Observable<ICommand> {
    return events$.pipe(
      ofType(SnapGeneratedEvent),
      map((event) => new CreateSnapCommand(event.generatedSnap))
    );
  }
}
