export class SnapGeneratedEvent {
  constructor(
    public readonly title: string,
    public readonly imageUrl: string,
    public readonly htmlContent?: string,
    public readonly textContent?: string
  ) {}
}
