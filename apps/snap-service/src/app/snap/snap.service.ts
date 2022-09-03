import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Snap } from '@prisma/client';
import { GenerateSnapCommand } from './commands/impl/generate-snap.command';
import { GenerateSnapDto } from './dto';

@Injectable()
export class SnapService {
  constructor(private readonly commandBus: CommandBus) {}

  async generate(data: GenerateSnapDto): Promise<Snap> {
    return this.commandBus.execute(new GenerateSnapCommand(data.url));
  }
}
