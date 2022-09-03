import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Snap } from '@prisma/client';
import { GenerateSnapCommand } from '../impl/generate-snap.command';

@CommandHandler(GenerateSnapCommand)
export class GenerateSnapHandler implements ICommandHandler<GenerateSnapCommand> {
  constructor(private readonly commandBus: CommandBus) {}

  async execute({ url }: GenerateSnapCommand): Promise<Snap> {
    return null;
  }
}
