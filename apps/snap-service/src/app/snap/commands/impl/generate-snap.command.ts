import { GenerateSnapDto } from '../../dto';

export class GenerateSnapCommand {
  constructor(public readonly generateSnapDto: GenerateSnapDto) {}
}
