import { Injectable } from '@nestjs/common';
import { Prisma, Snap } from '@prisma/client';
import { PrismaService } from '@snppd/models';

@Injectable()
export class SnapDao {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.SnapCreateInput): Promise<Snap> {
    return this.prismaService.snap.create({ data });
  }

  async delete(id: string): Promise<Snap> {
    return this.prismaService.snap.delete({ where: { id } });
  }
}
