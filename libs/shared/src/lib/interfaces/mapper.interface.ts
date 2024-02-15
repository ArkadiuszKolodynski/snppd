export interface Mapper<Domain, Persistance, Dto> {
  toDomain(item: Persistance | Dto): Domain | Promise<Domain>;
  toDto(item: Domain): Dto | Promise<Dto>;
  toPersistance(item: Domain): Persistance | Promise<Persistance>;
}
