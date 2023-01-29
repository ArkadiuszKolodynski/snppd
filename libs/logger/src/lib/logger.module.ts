import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Logger } from './logger.service';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: [
        { transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty', options: {} } : undefined },
        process.stdout,
      ],
    }),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
