import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../lib/prisma.service';

export function registerLoggingMiddleware(prismaService: PrismaService, logger: Logger) {
  prismaService.$on('query' as never, async (event: Prisma.QueryEvent) => {
    logger.debug(`(${event.duration}ms) ${event.query}`);
    logger.debug(`Params: ${event.params}`);
  });
}
