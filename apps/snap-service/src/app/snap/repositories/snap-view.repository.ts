import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class SnapViewRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.snap.findMany();
  }
}
