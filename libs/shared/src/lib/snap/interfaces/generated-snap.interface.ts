import { Snap } from '@prisma-snap/client';

export type GeneratedSnap = Omit<Snap, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
