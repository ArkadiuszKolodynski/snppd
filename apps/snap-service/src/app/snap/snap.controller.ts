import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { GenerateSnapDto } from './dto';
import { SnapService } from './snap.service';

@Controller('snaps')
export class SnapController {
  constructor(private readonly snapService: SnapService) {}

  @Post('generate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Triggers snap generation' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  generate(@Body() generateSnapDto: GenerateSnapDto): Promise<void> {
    return this.snapService.generate(generateSnapDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'Validation errors' })
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.snapService.delete(id);
  }
}
