import { faker } from '@faker-js/faker';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ISnap } from '@snppd/shared';

export class SnapResponseDto implements ISnap {
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

  @ApiProperty({ example: faker.image.url() })
  readonly screenshotUrl: string;

  @ApiProperty({ example: faker.image.url() })
  readonly headlineImageUrl: string;

  @ApiPropertyOptional({ example: faker.person.fullName() })
  readonly author?: string | null;

  @ApiPropertyOptional({ example: faker.lorem.paragraph() })
  readonly content?: string | null;

  @ApiPropertyOptional({ example: faker.lorem.sentence() })
  readonly excerpt?: string | null;

  @ApiPropertyOptional({ example: faker.number.int() })
  readonly length?: number | null;

  @ApiPropertyOptional({ example: faker.location.countryCode() })
  readonly lang?: string | null;
}
