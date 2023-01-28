import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from './page-meta-dto-parameters.interface';

export class PageMetaDto {
  @ApiProperty({ example: 1 })
  readonly page: number;

  @ApiProperty({ example: 10 })
  readonly take: number;

  @ApiProperty({ example: 100 })
  readonly itemCount: number;

  @ApiProperty({ example: 10 })
  readonly pageCount: number;

  @ApiProperty({ example: false })
  readonly hasPreviousPage: boolean;

  @ApiProperty({ example: true })
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
