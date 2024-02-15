import { PrismaClient } from '@prisma/client';
import { IdentifiableObject, Mapper } from '../interfaces';
import { FindManyOptions } from './find-many-options.interface';
import { Repository } from './repository.interface';

export abstract class BaseRepository<T extends IdentifiableObject, SelectInput, WhereInput, A, B>
  implements Repository<T, SelectInput, WhereInput>
{
  protected readonly prisma: PrismaClient;
  protected readonly modelName: string;
  protected readonly modelMapper: Mapper<T, A, B>;

  constructor(prismaService: PrismaClient, modelName: string, modelMapper: Mapper<T, A, B>) {
    this.prisma = prismaService;
    this.modelName = modelName.toLowerCase();
    this.modelMapper = modelMapper;
  }

  findMany(options?: FindManyOptions<SelectInput, WhereInput>): Promise<T[]> {
    const { pageOptionsDto, select, where } = { ...options };
    return this.prisma[this.modelName].findMany({
      skip: pageOptionsDto?.skip,
      take: pageOptionsDto?.take,
      orderBy: { createdAt: pageOptionsDto?.order },
      select,
      where,
    });
  }

  findManyAndCount(options?: FindManyOptions<SelectInput, WhereInput>): Promise<[T[], number]> {
    const { pageOptionsDto, select, where } = { ...options };
    return this.prisma.$transaction([
      this.prisma[this.modelName].findMany({
        skip: pageOptionsDto?.skip,
        take: pageOptionsDto?.take,
        orderBy: { createdAt: pageOptionsDto?.order },
        select,
        where,
      }),
      this.prisma[this.modelName].count(where),
    ]);
  }

  findById(id: string, select?: SelectInput): Promise<T | null> {
    return this.prisma[this.modelName].findUnique({
      where: { id },
      select,
    });
  }

  async save(item: T): Promise<void> {
    console.log('item:', item);
    const persistedItem = await this.prisma[this.modelName].findUnique({ where: { id: item.id } });
    console.log('persistedItem:', persistedItem);
    if (!persistedItem) {
      await this.prisma[this.modelName].create({ data: this.modelMapper.toPersistance(item) });
      return;
    }
    await this.prisma[this.modelName].update({
      where: { id: item.id },
      data: this.modelMapper.toPersistance(item),
    });
  }

  // create(data: CreateInput): Promise<T> {
  //   return this.prisma[this.modelName].create({ data });
  // }

  // update(id: string, data: UpdateInput): Promise<T> {
  //   return this.prisma[this.modelName].update({
  //     where: { id },
  //     data,
  //   });
  // }

  async remove(item: T): Promise<void> {
    await this.prisma[this.modelName].delete({
      where: { id: item.id },
    });
  }
}
