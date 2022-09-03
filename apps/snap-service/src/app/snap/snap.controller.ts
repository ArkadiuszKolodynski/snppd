import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Snap } from '@prisma/client';
import { SnapResponse } from './docs';
import { GenerateSnapDto } from './dto';
import { SnapService } from './snap.service';

@Controller('snaps')
export class SnapController {
  constructor(private readonly snapService: SnapService) {}

  @Post('generate')
  @ApiCreatedResponse({ type: SnapResponse })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  async generateSnap(@Body() generateSnapDto: GenerateSnapDto): Promise<Snap> {
    return this.snapService.generate(generateSnapDto);
  }
}
