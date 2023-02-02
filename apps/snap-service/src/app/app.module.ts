import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { LoggerModule } from '@snppd/logger';
import { PrismaModule } from './prisma/prisma.module';

import { BullModule } from '@nestjs/bull';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { SnapModule } from './snap/snap.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.redisHost,
          port: configService.redisPort,
        },
      }),
    }),
    ConfigModule,
    LoggerModule,
    PrismaModule,
    SnapModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true, forbidUnknownValues: true }),
    },
  ],
})
export class AppModule {}
