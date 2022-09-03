import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { SNAP_QUEUE_NAME } from './constants';
import { SnapController } from './snap.controller';
import { SnapService } from './snap.service';

@Module({
  imports: [BullModule.registerQueue({ name: SNAP_QUEUE_NAME }), CqrsModule],
  controllers: [SnapController],
  providers: [SnapService, ...CommandHandlers],
})
export class SnapModule {}
