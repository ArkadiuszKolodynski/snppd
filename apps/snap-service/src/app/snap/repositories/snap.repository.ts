import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-snap/client';
import { Logger } from '@snppd/logger';
import { FindManyOptions, IdentifiableObject } from '@snppd/shared';
import { subDays } from 'date-fns';
import { ConfigService } from '../../config/config.service';
import { DatabaseService } from '../../database/database.service';
import { Snap } from '../snap';
import { SnapMapper } from '../snap.mapper';
import { ISnapRepository } from './snap-repository.interface';

@Injectable()
export class SnapRepository implements ISnapRepository<Prisma.SnapSelect, Prisma.SnapWhereInput> {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly snapMapper: SnapMapper,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  findMany(options?: FindManyOptions<SelectInput, WhereInput>): Promise<Snap[]> {
    const { pageOptionsDto, select, where } = { ...options };
    return this.databaseService.snap.findMany({
      skip: pageOptionsDto?.skip,
      take: pageOptionsDto?.take,
      orderBy: { createdAt: pageOptionsDto?.order },
      select,
      where,
    });
  }

  findManyAndCount(options?: FindManyOptions<SelectInput, WhereInput>): Promise<[T[], number]> {
    const { pageOptionsDto, select, where } = { ...options };
    return this.databaseService.$transaction([
      this.databaseService.snap.findMany({
        skip: pageOptionsDto?.skip,
        take: pageOptionsDto?.take,
        orderBy: { createdAt: pageOptionsDto?.order },
        select,
        where,
      }),
      this.databaseService.snap.count(where),
    ]);
  }

  findById(id: string, select?: SelectInput): Promise<T | null> {
    return this.databaseService.snap.findUnique({
      where: { id },
      select,
    });
  }

  async save(item: T): Promise<void> {
    console.log('item:', item);
    const persistedItem = await this.databaseService.snap.findUnique({ where: { id: item.id } });
    console.log('persistedItem:', persistedItem);
    if (!persistedItem) {
      await this.databaseService.snap.create({ data: this.modelMapper.toPersistance(item) });
      return;
    }
    await this.databaseService.snap.update({
      where: { id: item.id },
      data: this.modelMapper.toPersistance(item),
    });
  }

  // FIXME: https://github.com/prisma/prisma/issues/10142
  async remove(snap: Snap): Promise<void> {
    // return this.prismaService.snap.update({ where: { id }, data: { deletedAt: new Date() } });
    try {
      await this.databaseService.snap.update({ where: { id: snap.id }, data: { deletedAt: new Date() } });
    } catch (err) {
      this.logger.warn(err.message);
    }
  }

  // FIXME: https://github.com/prisma/prisma/issues/8131
  prune(): Promise<IdentifiableObject[]> {
    // return this.prismaService.snap.deleteMany({
    //   where: { deletedAt: { lte: subDays(new Date(), this.configService.pruneSnapsDelayInDays) } },
    // });
    const delay = subDays(new Date(), this.configService.pruneSnapsDelayInDays);
    return this.databaseService.$queryRaw<IdentifiableObject[]>(
      Prisma.sql`DELETE FROM "public"."Snap" WHERE "deletedAt" <= TO_TIMESTAMP(${delay.getTime()} / 1000.0) RETURNING "id"`,
    );
  }
}
