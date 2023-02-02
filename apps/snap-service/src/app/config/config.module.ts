import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { getValidateFn } from '@snppd/shared';
import { ConfigService } from './config.service';
import { Configuration } from './configuration.class';

@Global()
@Module({
  imports: [NestConfigModule.forRoot({ validate: getValidateFn(Configuration) })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
