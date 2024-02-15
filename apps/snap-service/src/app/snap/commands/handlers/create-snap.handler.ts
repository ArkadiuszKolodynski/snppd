import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SnapCreatedEvent } from '@snppd/events';
import { SnapRepository } from '../../repositories/snap.repository';
import { Snap } from '../../snap';
import { CreateSnapCommand } from '../impl/create-snap.command';

@CommandHandler(CreateSnapCommand)
export class CreateSnapHandler implements ICommandHandler<CreateSnapCommand> {
  constructor(
    private readonly repository: SnapRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ generatedSnap }: CreateSnapCommand): Promise<void> {
    const { author, content, excerpt, id, lang, length, screenshotUrl, headlineImageUrl, tags, title, url, userId } =
      generatedSnap;
    const snap = new Snap(
      id,
      userId,
      url,
      tags,
      title,
      screenshotUrl,
      headlineImageUrl,
      author,
      content,
      excerpt,
      length,
      lang,
    );
    console.log('snap:', snap);
    await this.repository.save(snap);
    this.eventBus.publish(new SnapCreatedEvent(snap));
  }
}
