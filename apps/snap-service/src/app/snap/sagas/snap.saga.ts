import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { SnapGeneratedEvent } from '@snppd/events';
import { map, Observable } from 'rxjs';
import { CreateSnapCommand } from '../commands/impl/create-snap.command';

@Injectable()
export class SnapSagas {
  @Saga()
  snapGenerated = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SnapGeneratedEvent),
      map((event) => new CreateSnapCommand(event))
    );
  };
}
