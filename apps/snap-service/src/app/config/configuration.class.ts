import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class Configuration {
  @IsString()
  @Expose({ name: 'DATABASE_URL' })
  readonly databaseUrl: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  @Type(() => Number)
  @Expose({ name: 'PORT' })
  readonly port?: number = 3000;

  @IsString()
  @IsOptional()
  @Expose({ name: 'REDIS_HOST' })
  readonly redisHost?: string = 'localhost';

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  @Type(() => Number)
  @Expose({ name: 'REDIS_PORT' })
  readonly redisPort?: number = 6379;

  @IsString()
  @IsOptional()
  @Expose({ name: 'PRUNE_SNAPS_CRON' })
  readonly pruneSnapsCron?: string = '0 2 * * *';

  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  @Type(() => Number)
  @Expose({ name: 'PRUNE_SNAPS_DELAY_IN_DAYS' })
  readonly pruneSnapsDelayInDays?: number = 30;
}
