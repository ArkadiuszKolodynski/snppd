import { faker } from '@faker-js/faker';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Snap } from '@prisma/client';

export class SnapDto implements Snap {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: faker.lorem.slug() })
  name: string;

  @ApiProperty({ example: faker.internet.url() })
  url: string;

  @ApiProperty({ example: [faker.word.noun(), faker.word.noun()] })
  tags: string[];

  @ApiProperty({ example: faker.lorem.sentence(4) })
  title: string;

  @ApiPropertyOptional({ example: faker.lorem.paragraph() })
  htmlContent: string | null;

  @ApiPropertyOptional({ example: faker.lorem.paragraph() })
  textContent: string | null;

  @ApiProperty({ example: faker.internet.url() })
  imageUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date | null;

  @ApiPropertyOptional()
  deletedAt: Date | null;
}
