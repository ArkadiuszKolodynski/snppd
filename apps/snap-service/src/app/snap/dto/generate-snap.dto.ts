import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class GenerateSnapDto {
  @ApiProperty({ description: 'URL to snap', example: faker.internet.url() })
  @IsUrl()
  url: string;
}
