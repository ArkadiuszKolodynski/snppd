import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { SNAP_QUEUE_NAME } from './constants';
import { SnapDao } from './dao/snap.dao';
import { SnapSagas } from './sagas/snap.saga';
import { SnapController } from './snap.controller';
import { SnapProcessor } from './snap.processor';
import { SnapService } from './snap.service';

@Module({
  imports: [BullModule.registerQueue({ name: SNAP_QUEUE_NAME }), CqrsModule],
  controllers: [SnapController],
  providers: [SnapService, SnapProcessor, SnapSagas, SnapDao, ...CommandHandlers],
})
export class SnapModule {}
