import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateSnapCommand } from './commands/impl/generate-snap.command';
import { SoftDeleteSnapCommand } from './commands/impl/soft-delete-snap.command';
import { GenerateSnapDto } from './dto';

@Injectable()
export class SnapService {
  constructor(private readonly commandBus: CommandBus) {}

  generate(generateSnapDto: GenerateSnapDto): Promise<void> {
    return this.commandBus.execute(new GenerateSnapCommand(generateSnapDto));
  }

  delete(id: string): Promise<void> {
    return this.commandBus.execute(new SoftDeleteSnapCommand(id));
  }
}
