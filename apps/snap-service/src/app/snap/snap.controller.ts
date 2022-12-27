import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { Snap } from '@prisma/client';
import { PrismaService } from '@snppd/models';
import { GenerateSnapDto, SnapDto } from './dto';
import { SnapService } from './snap.service';

@Controller('snaps')
export class SnapController {
  constructor(private readonly snapService: SnapService, private readonly prismaService: PrismaService) {}

  @Post('generate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Triggers snap generation' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  generate(@Body() generateSnapDto: GenerateSnapDto): Promise<void> {
    return this.snapService.generate(generateSnapDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: SnapDto })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.snapService.delete(id);
  }

  @Get()
  getSnaps(): Promise<Snap[]> {
    return this.prismaService.snap.findMany();
  }
}
