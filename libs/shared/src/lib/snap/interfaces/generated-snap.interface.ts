import { Snap } from '@prisma/client';

export type GeneratedSnap = Omit<Snap, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
