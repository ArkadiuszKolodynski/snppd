import { Snap } from '@prisma-snap/client';

export type SnapGenerationResult = Omit<Snap, 'userId' | 'tags' | 'createdAt' | 'updatedAt' | 'deletedAt'> | null;

export interface SnapExecutor {
  generateSnap(id: string, url: string): Promise<SnapGenerationResult>;
}

export const SnapExecutor = Symbol('SnapExecutor');
