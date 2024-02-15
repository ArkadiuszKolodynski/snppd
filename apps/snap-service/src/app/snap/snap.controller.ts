import { faker } from '@faker-js/faker';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedOkResponse, PageDto, PageOptionsDto } from '@snppd/shared';
import { DeleteSnapCommand } from './commands/impl/delete-snap.command';
import { EnqueueSnapGenerationCommand } from './commands/impl/enqueue-snap-generation.command';
import { UpdateSnapCommand } from './commands/impl/update-snap.command';
import { GenerateSnapDto, SnapResponseDto, UpdateSnapDto } from './dto';
import { FindSnapByIdQuery } from './queries/impl/find-snap-by-id.command';
import { FindSnapsQuery } from './queries/impl/find-snaps.command';

@ApiTags('snaps')
@Controller('snaps')
export class SnapController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Get()
  @ApiPaginatedOkResponse(SnapResponseDto)
  @ApiBadRequestResponse({ description: 'Validation errors' })
  getPage(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<SnapResponseDto>> {
    // TODO: get userId from request
    const userId = faker.datatype.uuid();
    return this.queryBus.execute(new FindSnapsQuery(pageOptionsDto, userId));
  }

  @Get(':id')
  @ApiOkResponse({ type: SnapResponseDto })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  @ApiNotFoundResponse({ description: 'Snap not found' })
  getById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<SnapResponseDto> {
    // TODO: get userId from request
    const userId = faker.datatype.uuid();
    return this.queryBus.execute(new FindSnapByIdQuery(id, userId));
  }

  @Post('generate')
  @ApiOperation({ summary: 'asdf' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Triggers snap generation' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  generate(@Body() generateSnapDto: GenerateSnapDto): Promise<void> {
    // TODO: get userId from request
    const userId = faker.datatype.uuid();
    return this.commandBus.execute(new EnqueueSnapGenerationCommand(generateSnapDto, userId));
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'Validation errors' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateSnapDto: UpdateSnapDto
  ): Promise<void> {
    // TODO: get userId from request
    const userId = faker.datatype.uuid();
    return this.commandBus.execute(new UpdateSnapCommand(id, updateSnapDto, userId));
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'Validation errors' })
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
    // TODO: get userId from request
    const userId = faker.datatype.uuid();
    return this.commandBus.execute(new DeleteSnapCommand(id, userId));
  }
}
