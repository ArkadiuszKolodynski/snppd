import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsString, IsUrl, IsUUID, MaxLength, MinLength } from 'class-validator';

export class GenerateSnapDto {
  @ApiProperty({ description: 'Snap ID', example: faker.string.uuid() })
  @IsUUID('4')
  readonly id: string;

  @ApiProperty({ description: 'URL to snap', example: faker.internet.url() })
  @IsUrl()
  readonly url: string;

  @ApiProperty({ description: 'Snap tags', isArray: true, example: [faker.word.sample(), faker.word.sample()] })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(255, { each: true })
  readonly tags: string[];
}
