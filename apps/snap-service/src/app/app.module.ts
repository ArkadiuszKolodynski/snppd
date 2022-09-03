import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelsModule } from '@snppd/models';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnapModule } from './snap/snap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ModelsModule,
    SnapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
