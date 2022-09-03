import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { SnapGeneratedEvent } from '@snppd/events';
import { map, Observable } from 'rxjs';

@Injectable()
export class SnapSagas {
  @Saga()
  snapGenerated = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(SnapGeneratedEvent),
      map((event) => console.log(`Snap generated ${event}`))
    );
  };
}
