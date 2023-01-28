import { Snap } from '@prisma-snap/client';

export type FailedSnap = Pick<Snap, 'url' | 'userId'>;
