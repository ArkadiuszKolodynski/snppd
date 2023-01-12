import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WebSocketsModule } from '@snppd/websockets';
import { SNAP_QUEUE_NAME } from '../constants';
import { CommandHandlers } from './commands/handlers';
import { SnapDao } from './dao/snap.dao';
import { EventHandlers } from './events';
import { PuppeteerSnapExecutor, SnapExecutor } from './executors';
import { QueryHandlers } from './queries/handlers';
import { SnapSagas } from './sagas/snap.sagas';
import { SnapController } from './snap.controller';
import { SnapProcessor } from './snap.processor';
import { SnapService } from './snap.service';

@Module({
  imports: [BullModule.registerQueue({ name: SNAP_QUEUE_NAME }), CqrsModule, WebSocketsModule],
  controllers: [SnapController],
  providers: [
    SnapDao,
    SnapProcessor,
    SnapSagas,
    SnapService,
    { provide: SnapExecutor, useClass: PuppeteerSnapExecutor },
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class SnapModule {}
