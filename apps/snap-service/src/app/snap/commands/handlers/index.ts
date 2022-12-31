import { CreateSnapHandler } from './create-snap.handler';
import { DeleteSnapHandler } from './delete-snap.handler';
import { EnqueueSnapGenerationHandler } from './enqueue-snap-generation.handler';
import { GenerateSnapHandler } from './generate-snap.handler';
import { PruneSnapsHandler } from './prune-snaps.handler';
import { ScheduleSnapsPruneHandler } from './schedule-snaps-prune.handler';

export const CommandHandlers = [
  CreateSnapHandler,
  PruneSnapsHandler,
  EnqueueSnapGenerationHandler,
  GenerateSnapHandler,
  ScheduleSnapsPruneHandler,
  DeleteSnapHandler,
];
