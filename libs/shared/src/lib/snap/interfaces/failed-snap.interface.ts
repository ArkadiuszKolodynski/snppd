import { Snap } from '@prisma/client';

export type FailedSnap = Pick<Snap, 'url' | 'userId'>;
