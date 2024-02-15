import { NotFoundException } from '@nestjs/common';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { SnapResponseDto } from '../../dto';
import { SnapRepository } from '../../repositories/snap.repository';
import { FindSnapByIdQuery } from '../impl/find-snap-by-id.command';

@QueryHandler(FindSnapByIdQuery)
export class FindSnapByIdHandler implements ICommandHandler<FindSnapByIdQuery> {
  constructor(private readonly repository: SnapRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute({ id, userId }: FindSnapByIdQuery): Promise<SnapResponseDto> {
    // TODO: check if snap exist and if user owns snap
    const snap = await this.repository.findById(id);
    if (!snap) {
      throw new NotFoundException('Snap not found');
    }
    return plainToInstance(SnapResponseDto, snap);
  }
}
