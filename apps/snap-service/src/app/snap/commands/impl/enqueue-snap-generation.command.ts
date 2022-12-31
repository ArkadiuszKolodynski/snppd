import { GenerateSnapDto } from '../../dto';

export class EnqueueSnapGenerationCommand {
  constructor(public readonly generateSnapDto: GenerateSnapDto) {}
}
