import { Prisma } from '@prisma/client';
import { PrismaService } from '../lib/prisma.service';

export function findSnapMiddleware(prismaService: PrismaService) {
  prismaService.$use(async (params, next) => {
    if (params.model !== 'Snap') {
      return next(params);
    }

    params.args = params.args || {};
    handleFindUnique(params);
    handleFindMany(params);

    return next(params);
  });
}

function handleFindUnique(params: Prisma.MiddlewareParams): void {
  if (params.action === 'findFirst' || params.action === 'findUnique') {
    params.action = 'findFirst';
    params.args.where.deletedAt = null;
  }
}

function handleFindMany(params: Prisma.MiddlewareParams): void {
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
