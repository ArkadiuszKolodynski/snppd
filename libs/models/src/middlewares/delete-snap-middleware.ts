import { Prisma } from '@prisma/client';
import { PrismaService } from '../lib/prisma.service';

export function deleteSnapMiddleware(prismaService: PrismaService) {
  prismaService.$use(async (params, next) => {
    if (params.model !== 'Snap') {
      return next(params);
    }

    params.args = params.args || {};
    handleDelete(params);
    handleDeleteMany(params);

    return next(params);
  });
}

function handleDelete(params: Prisma.MiddlewareParams): void {
  if (params.action === 'delete') {
    params.action = 'update';
    params.args.data = { deletedAt: new Date() };
  }
}

function handleDeleteMany(params: Prisma.MiddlewareParams): void {
  if (params.action === 'deleteMany') {
    params.action = 'updateMany';
    if (params.args.data !== undefined) {
      params.args.data.deletedAt = new Date();
    } else {
      params.args.data = { deletedAt: new Date() };
    }
  }
}
