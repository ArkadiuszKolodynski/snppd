import { Injectable } from '@nestjs/common';
import { Prisma, Snap } from '@prisma-snap/client';
import { PageOptionsDto } from '@snppd/shared';
import { subDays } from 'date-fns';
import { ConfigService } from '../../config/config.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SnapDao {
  constructor(private readonly configService: ConfigService, private readonly prismaService: PrismaService) {}

  // TODO: Enable filtering by userId when users will be added
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findManyAndCount(pageOptionsDto: PageOptionsDto, userId: string): Promise<[Snap[], number]> {
    const { skip, order, take } = pageOptionsDto;

    return this.prismaService.$transaction([
      this.prismaService.snap.findMany({
        skip,
        take,
        orderBy: { createdAt: order },
        /* where: { userId }, */
      }),
      this.prismaService.snap.count(/* { where: { userId } } */),
    ]);
  }

  findById(id: string): Promise<Snap> {
    return this.prismaService.snap.findUnique({ where: { id } });
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
    //   where: { deletedAt: { lte: subDays(new Date(), this.configService.pruneSnapsDelayInDays) } },
    // });
    const delay = subDays(new Date(), this.configService.pruneSnapsDelayInDays);
    return this.prismaService.$queryRaw<Snap[]>(
      Prisma.sql`DELETE FROM "public"."Snap" WHERE "deletedAt" <= TO_TIMESTAMP(${delay.getTime()} / 1000.0) RETURNING "id"`
    );
  }
}
