import { faker } from '@faker-js/faker';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Snap } from '@prisma/client';

export class SnapResponse implements Partial<Snap> {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: faker.lorem.slug() })
  title: string;

  @ApiPropertyOptional({ example: faker.lorem.paragraphs(2) })
  content: string | null;

  @ApiProperty({ format: 'url', example: faker.internet.url() })
  imageUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date | null;
}
