import { PageOptionsDto } from '../pagination';

export interface FindManyOptions<SelectInput, WhereInput> {
  pageOptionsDto?: PageOptionsDto;
  select?: SelectInput;
  where?: WhereInput;
}
