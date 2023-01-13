import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, Snap } from '@prisma/client';
import { PrismaService } from '@snppd/models';
import { subDays } from 'date-fns';

@Injectable()
export class SnapDao {
  private readonly PRUNE_SNAPS_DELAY_IN_DAYS: number;

  constructor(private readonly configService: ConfigService, private readonly prismaService: PrismaService) {
    this.PRUNE_SNAPS_DELAY_IN_DAYS = this.configService.get('PRUNE_SNAPS_DELAY_IN_DAYS') || 30;
  }

  create(data: Prisma.SnapCreateInput): Promise<Snap> {
    return this.prismaService.snap.create({ data });
  }

  update(id: string, data: Prisma.SnapUpdateInput): Promise<Snap> {
    return this.prismaService.snap.update({ where: { id }, data });
  }

  // FIXME: https://github.com/prisma/prisma/issues/10142
  async delete(id: string): Promise<Snap> {
    // return this.prismaService.snap.update({ where: { id }, data: { deletedAt: new Date() } });
    try {
      return await this.prismaService.snap.update({ where: { id }, data: { deletedAt: new Date() } });
    } catch (err) {
      return null;
    }
  }

  // FIXME: https://github.com/prisma/prisma/issues/8131
  prune(): Promise<Snap[]> {
    // return this.prismaService.snap.deleteMany({
    //   where: { deletedAt: { lte: subDays(new Date(), this.PRUNE_SNAPS_DELAY_IN_DAYS) } },
    // });
    const delay = subDays(new Date(), this.PRUNE_SNAPS_DELAY_IN_DAYS);
    return this.prismaService.$queryRaw<Snap[]>(
      Prisma.sql`DELETE FROM "public"."Snap" WHERE "deletedAt" <= TO_TIMESTAMP(${delay.getTime()} / 1000.0) RETURNING "id"`
    );
  }
}
