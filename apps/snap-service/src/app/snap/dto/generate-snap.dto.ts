import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class GenerateSnapDto {
  @ApiProperty({ example: faker.random.words(2), minLength: 3, maxLength: 255 })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'URL to snap', example: faker.internet.url() })
  @IsUrl()
  url: string;
}
