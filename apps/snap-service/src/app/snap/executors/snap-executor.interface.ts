import { Snap } from '@prisma-snap/client';

export type SnapGenerationResult = Omit<
  Snap,
  'id' | 'userId' | 'tags' | 'createdAt' | 'updatedAt' | 'deletedAt'
> | null;

export interface SnapExecutor {
  generateSnap(url: string): Promise<SnapGenerationResult>;
}

export const SnapExecutor = Symbol('SnapExecutor');
