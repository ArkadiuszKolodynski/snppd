import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { GenerateSnapDto } from './dto';
import { SnapService } from './snap.service';

@Controller('snaps')
export class SnapController {
  constructor(private readonly snapService: SnapService) {}

  @Post('generate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Triggers snap generation' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  async generate(@Body() generateSnapDto: GenerateSnapDto): Promise<void> {
    return this.snapService.generate(generateSnapDto);
  }
}
