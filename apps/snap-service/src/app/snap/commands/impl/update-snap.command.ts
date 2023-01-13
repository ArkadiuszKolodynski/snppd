import { UpdateSnapDto } from '../../dto/update-snap.dto';

export class UpdateSnapCommand {
  constructor(
    public readonly id: string,
    public readonly updateSnapDto: UpdateSnapDto,
    public readonly userId: string
  ) {}
}
