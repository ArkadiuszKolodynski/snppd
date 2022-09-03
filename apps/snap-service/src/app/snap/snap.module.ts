import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { SnapController } from './snap.controller';
import { SnapService } from './snap.service';

@Module({
  imports: [CqrsModule],
  controllers: [SnapController],
  providers: [SnapService, ...CommandHandlers],
})
export class SnapModule {}
