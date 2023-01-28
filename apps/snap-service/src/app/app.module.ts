import { BullModule } from '@nestjs/bull';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';

import { SnapModule } from './snap/snap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: +configService.get('REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    SnapModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
