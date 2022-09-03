export class SnapGeneratedEvent {
  constructor(
    public readonly name: string,
    public readonly url: string,
    public readonly title: string,
    public readonly imageUrl: string,
    public readonly htmlContent?: string,
    public readonly textContent?: string
  ) {}
}
