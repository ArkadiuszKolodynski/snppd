import { CreateSnapHandler } from './create-snap.handler';
import { DeleteSnapHandler } from './delete-snap.handler';
import { GenerateSnapHandler } from './generate-snap.handler';

export const CommandHandlers = [CreateSnapHandler, GenerateSnapHandler, DeleteSnapHandler];
