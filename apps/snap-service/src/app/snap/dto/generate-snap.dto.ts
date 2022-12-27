import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class GenerateSnapDto {
  @ApiProperty({ description: 'Name of the snap', example: faker.random.words(2), minLength: 3, maxLength: 255 })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  readonly name: string;

  @ApiProperty({ description: 'URL to snap', example: faker.internet.url() })
  @IsUrl()
  readonly url: string;

  @ApiProperty({ description: 'Snap tags', isArray: true, example: [faker.random.word(), faker.random.word()] })
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(255, { each: true })
  readonly tags: string[];
}
