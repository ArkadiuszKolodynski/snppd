import { FindManyOptions, IdentifiableObject } from '@snppd/shared';
import { Snap } from '../snap';

export interface ISnapRepository<SelectInput, WhereInput> {
  findMany(options?: FindManyOptions<SelectInput, WhereInput>): Promise<Snap[]>;
  findById(id: string): Promise<Snap | null>;
  save(snap: Snap): Promise<void>;
  remove(snap: Snap): Promise<void>;
  prune(): Promise<IdentifiableObject[]>;
}
