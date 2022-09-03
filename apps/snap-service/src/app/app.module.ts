import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModelsModule } from '@snppd/models';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnapModule } from './snap/snap.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ModelsModule, SnapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
