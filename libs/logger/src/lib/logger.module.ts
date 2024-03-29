import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Logger } from './logger.service';
import { redactKeys } from './redact/redact-keys';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: [
        {
          redact: redactKeys,
          enabled: process.env.NODE_ENV !== 'test',
          level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          transport:
            process.env.NODE_ENV !== 'production'
              ? { target: 'pino-pretty', options: { translateTime: 'SYS:dd/mm/yyyy, HH:MM:ss.l', singleLine: true } }
              : undefined,
        },
        process.stdout,
      ],
    }),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
