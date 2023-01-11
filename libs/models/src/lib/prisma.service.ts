import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { registerFindSnapMiddleware, registerLoggingMiddleware } from '../middlewares';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ log: [{ emit: 'event', level: 'query' }] });
  }

  async onModuleInit() {
    await this.$connect();

    registerLoggingMiddleware(this, this.logger);
    registerFindSnapMiddleware(this);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
