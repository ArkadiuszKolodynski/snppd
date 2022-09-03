import { SnapPayload } from '../../interfaces/snap-payload.interface';

export class CreateSnapCommand {
  constructor(public readonly payload: SnapPayload) {}
}
