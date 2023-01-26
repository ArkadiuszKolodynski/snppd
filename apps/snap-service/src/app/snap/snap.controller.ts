import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { GenerateSnapDto, SnapResponseDto, UpdateSnapDto } from './dto';
import { SnapService } from './snap.service';

@Controller('snaps')
export class SnapController {
  constructor(private readonly snapService: SnapService) {}

  @Get(':id')
  @ApiOkResponse({ type: SnapResponseDto })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  @ApiNotFoundResponse({ description: 'Snap not found' })
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<SnapResponseDto> {
    // TODO: get userId from request
    const userId = v4();
    return this.snapService.findById(id, userId);
  }

  @Post('generate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Triggers snap generation' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  generate(@Body() generateSnapDto: GenerateSnapDto): Promise<void> {
    // TODO: get userId from request
    const userId = v4();
    return this.snapService.generate(generateSnapDto, userId);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'Validation errors' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSnapDto: UpdateSnapDto): Promise<void> {
    // TODO: get userId from request
    const userId = v4();
    return this.snapService.update(id, updateSnapDto, userId);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'Validation errors' })
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    // TODO: get userId from request
    const userId = v4();
    return this.snapService.delete(id, userId);
  }
}
