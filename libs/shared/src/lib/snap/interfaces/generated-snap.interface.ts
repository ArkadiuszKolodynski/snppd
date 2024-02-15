import { Snap } from '@prisma-snap/client';

export type GeneratedSnap = Omit<Snap, 'createdAt' | 'updatedAt' | 'deletedAt'>;
