import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WebSocketsModule } from '@snppd/websockets';
import { SNAP_QUEUE_NAME } from '../constants';
import { CommandHandlers } from './commands/handlers';
import { SnapDao } from './dao/snap.dao';
import { EventHandlers } from './events/handlers';
import { PuppeteerSnapExecutor, SnapExecutor } from './executors';
import { DOMPurifyProvider } from './providers/dompurify.provider';
import { QueryHandlers } from './queries/handlers';
import { SnapRepository } from './repositories/snap.repository';
import { SnapSagas } from './sagas/snap.sagas';
import { SnapController } from './snap.controller';
import { SnapMapper } from './snap.mapper';
import { SnapProcessor } from './snap.processor';
import { SnapService } from './snap.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SNAP_QUEUE_NAME,
      ...(process.env.NODE_ENV === 'production' && {
        defaultJobOptions: { removeOnComplete: 1000, removeOnFail: 5000 },
      }),
    }),
    CqrsModule,
    WebSocketsModule,
  ],
  controllers: [SnapController],
  providers: [
    SnapDao,
    SnapMapper,
    SnapProcessor,
    SnapRepository,
    SnapSagas,
    SnapService,
    DOMPurifyProvider,
    { provide: SnapExecutor, useClass: PuppeteerSnapExecutor },
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class SnapModule {}
