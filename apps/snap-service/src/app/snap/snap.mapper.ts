import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-snap/client';
import { ISnap, Mapper } from '@snppd/shared';
import { instanceToInstance } from 'class-transformer';
import { SnapResponseDto } from './dto';
import { Snap } from './snap';

@Injectable()
export class SnapMapper implements Mapper<Snap, Prisma.SnapCreateInput, SnapResponseDto> {
  toDomain(snap: ISnap): Snap | Promise<Snap> {
    return new Snap(
      snap.id,
      snap.userId,
      snap.url,
      snap.tags,
      snap.title,
      snap.screenshotUrl,
      snap.headlineImageUrl,
      snap.author,
      snap.content,
      snap.excerpt,
      snap.length,
      snap.lang,
    );
  }

  toDto(snap: Snap): SnapResponseDto | Promise<SnapResponseDto> {
    return instanceToInstance(snap);
  }

  toPersistance(snap: Snap): Prisma.SnapCreateInput | Promise<Prisma.SnapCreateInput> {
    return {
      screenshotUrl: snap.screenshotUrl,
      headlineImageUrl: snap.headlineImageUrl,
      title: snap.title,
      url: snap.url,
      userId: snap.userId,
      author: snap.author,
      content: snap.content,
      excerpt: snap.excerpt,
      id: snap.id,
      lang: snap.lang,
      length: snap.length,
      tags: snap.tags,
    };
  }
}
