import { CreateSnapHandler } from './create-snap.handler';
import { DeleteSnapHandler } from './delete-snap.handler';
import { GenerateSnapHandler } from './generate-snap.handler';
import { SoftDeleteSnapHandler } from './soft-delete-snap.handler';

export const CommandHandlers = [CreateSnapHandler, GenerateSnapHandler, DeleteSnapHandler, SoftDeleteSnapHandler];
