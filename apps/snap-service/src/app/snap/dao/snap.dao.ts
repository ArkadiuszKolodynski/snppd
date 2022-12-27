import { Injectable } from '@nestjs/common';
import { Prisma, Snap } from '@prisma/client';
import { PrismaService } from '@snppd/models';

@Injectable()
export class SnapDao {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.SnapCreateInput): Promise<Snap> {
    return this.prismaService.snap.create({ data });
  }

  delete(id: string): Promise<Snap> {
    return this.prismaService.snap.delete({ where: { id } });
  }

  softDelete(id: string): Promise<Snap> {
    return this.prismaService.snap.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
