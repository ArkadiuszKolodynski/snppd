export interface SnapExecutor {
  generateSnap(
    url: string
  ): Promise<{ imageBuffer: Buffer; title: string; htmlContent: string; textContent: string } | null>;
}

export const SnapExecutor = Symbol('SnapExecutor');
