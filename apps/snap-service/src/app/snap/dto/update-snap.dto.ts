import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSnapDto {
  @ApiProperty({ description: 'Snap tags', isArray: true, example: [faker.random.word(), faker.random.word()] })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(255, { each: true })
  readonly tags: string[];
}
