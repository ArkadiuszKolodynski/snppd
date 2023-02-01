import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma-snap/client';
import { Logger } from '@snppd/logger';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: Logger) {
    super({ log: [{ emit: 'event', level: 'query' }] });
    logger.setContext(PrismaService.name);
  }

  async onModuleInit(): Promise<void> {
    this.$on('query' as never, this.registerQueryLogs.bind(this));
    this.$use(this.registerSoftDeleteMiddleware.bind(this));
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', this.closeApp.bind(null, app));
  }

  async closeApp(app: INestApplication) {
    await app.close();
  }

  registerQueryLogs(event: Prisma.QueryEvent): void {
    this.logger.info(`(${event.duration}ms) ${event.query}`);
    this.logger.info(`Params: ${event.params}`);
  }

  registerSoftDeleteMiddleware(
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<unknown>
  ): Promise<unknown> {
    if (params.model !== 'Snap') {
      return next(params);
    }

    params.args = params.args || {};
    this.handleFindUnique(params);
    this.handleFindMany(params);

    return next(params);
  }

  private handleFindUnique(params: Prisma.MiddlewareParams): void {
    if (params.action === 'findFirst' || params.action === 'findUnique') {
      params.action = 'findFirst';
      params.args.where.deletedAt = null;
    }
  }

  private handleFindMany(params: Prisma.MiddlewareParams): void {
    if (params.action === 'findMany') {
      if (params.args.where) {
        if (params.args.where.deletedAt === undefined) {
          params.args.where.deletedAt = null;
        }
      } else {
        params.args.where = { deletedAt: null };
      }
    }
  }
}
