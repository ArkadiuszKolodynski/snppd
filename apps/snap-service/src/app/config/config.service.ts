import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { Configuration } from './configuration.class';

@Injectable()
export class ConfigService implements Configuration {
  constructor(private readonly nestConfigService: NestConfigService<Configuration>) {}

  get databaseUrl(): string {
    return this.nestConfigService.get('databaseUrl');
  }

  get port(): number {
    return this.nestConfigService.get('port');
  }

  get redisHost(): string {
    return this.nestConfigService.get('redisHost');
  }

  get redisPort(): number {
    return this.nestConfigService.get('redisPort');
  }

  get pruneSnapsCron(): string {
    return this.nestConfigService.get('pruneSnapsCron');
  }

  get pruneSnapsDelayInDays(): number {
    return this.nestConfigService.get('pruneSnapsDelayInDays');
  }

  get swaggerConfig(): Omit<OpenAPIObject, 'paths'> {
    return new DocumentBuilder()
      .setTitle('Snap Service')
      .setDescription('The snap API description')
      .setVersion('0.0.1')
      .addTag('snaps')
      .build();
  }
}
