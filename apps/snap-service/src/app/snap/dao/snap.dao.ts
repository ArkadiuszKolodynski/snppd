import { Injectable } from '@nestjs/common';
import { PrismaService } from '@snppd/models';

@Injectable()
export class SnapDao {
  constructor(private readonly prismaService: PrismaService) {}
}
