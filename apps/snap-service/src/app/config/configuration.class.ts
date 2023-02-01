import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class Configuration {
  @IsString()
  @Expose({ name: 'DATABASE_URL' })
  databaseUrl: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  @Type(() => Number)
  @Expose({ name: 'PORT' })
  port = 3000;

  @IsString()
  @IsOptional()
  @Expose({ name: 'REDIS_HOST' })
  redisHost = 'localhost';

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  @Type(() => Number)
  @Expose({ name: 'REDIS_PORT' })
  redisPort = 6379;

  @IsString()
  @IsOptional()
  @Expose({ name: 'PRUNE_SNAPS_CRON' })
  pruneSnapsCron = '0 2 * * *';

  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  @Type(() => Number)
  @Expose({ name: 'PRUNE_SNAPS_DELAY_IN_DAYS' })
  pruneSnapsDelayInDays = 30;
}
