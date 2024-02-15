import { IdentifiableObject } from '../interfaces';
import { FindManyOptions } from './find-many-options.interface';

export interface Repository<T extends IdentifiableObject, SelectInput, WhereInput> {
  findMany(options?: FindManyOptions<SelectInput, WhereInput>): Promise<T[]>;
  findManyAndCount(options?: FindManyOptions<SelectInput, WhereInput>): Promise<[T[], number]>;
  findById(id: string, select?: SelectInput): Promise<T | null>;
  save(item: T): Promise<void>;
  remove(item: T): Promise<void>;
}
