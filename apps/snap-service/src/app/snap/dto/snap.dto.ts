import { faker } from '@faker-js/faker';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Snap } from '@prisma/client';

export class SnapDto implements Snap {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ example: faker.internet.url() })
  url: string;

  @ApiProperty({ example: [faker.word.noun(), faker.word.noun()] })
  tags: string[];

  @ApiProperty({ example: faker.lorem.sentence(4) })
  title: string;

  @ApiPropertyOptional({ example: faker.name.fullName() })
  author: string | null;

  @ApiPropertyOptional({ example: faker.lorem.paragraph() })
  content: string | null;

  @ApiPropertyOptional({ example: faker.lorem.paragraph() })
  textContent: string | null;

  @ApiPropertyOptional({ example: faker.lorem.paragraph() })
  htmlContent: string | null;

  @ApiPropertyOptional({ example: faker.lorem.sentence() })
  excerpt: string | null;

  @ApiPropertyOptional({ example: faker.datatype.number() })
  length: number | null;

  @ApiPropertyOptional({ example: faker.random.locale() })
  lang: string | null;

  @ApiPropertyOptional({ example: faker.image.imageUrl() })
  screenshotUrl: string;

  @ApiPropertyOptional({ example: faker.image.imageUrl() })
  snapImageUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date | null;

  @ApiPropertyOptional()
  deletedAt: Date | null;
}
