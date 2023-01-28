import { faker } from '@faker-js/faker';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Snap } from '@prisma-snap/client';

export class SnapResponseDto implements Snap {
  @ApiProperty({ format: 'uuid' })
  readonly id: string;

  @ApiProperty({ format: 'uuid' })
  readonly userId: string;

  @ApiProperty({ example: faker.internet.url() })
  readonly url: string;

  @ApiProperty({ example: [faker.word.noun(), faker.word.noun()] })
  readonly tags: string[];

  @ApiProperty({ example: faker.lorem.sentence(4) })
  readonly title: string;

  @ApiPropertyOptional({ example: faker.name.fullName() })
  readonly author: string | null;

  @ApiPropertyOptional({ example: faker.lorem.paragraph() })
  readonly content: string | null;

  @ApiPropertyOptional({ example: faker.lorem.sentence() })
  readonly excerpt: string | null;

  @ApiPropertyOptional({ example: faker.datatype.number() })
  readonly length: number | null;

  @ApiPropertyOptional({ example: faker.random.locale() })
  readonly lang: string | null;

  @ApiPropertyOptional({ example: faker.image.imageUrl() })
  readonly screenshotUrl: string;

  @ApiPropertyOptional({ example: faker.image.imageUrl() })
  readonly snapImageUrl: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiPropertyOptional()
  readonly updatedAt: Date | null;

  @ApiPropertyOptional()
  readonly deletedAt: Date | null;
}
