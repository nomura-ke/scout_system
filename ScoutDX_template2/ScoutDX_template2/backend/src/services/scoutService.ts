import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseRepository } from '../repositories/database';
import { ScoutEntity } from '../types';

@Injectable()
export class ScoutService {
  constructor(private readonly scoutRepository: DatabaseRepository) {}

  findAll(): Promise<ScoutEntity[]> {
    return this.scoutRepository.findAll();
  }

  async create(input: ScoutEntity): Promise<ScoutEntity> {
    if (!input.creator?.trim() || !input.title?.trim() || !input.body?.trim()) {
      throw new BadRequestException('作成者・タイトル・本文は必須です');
    }

    const scout = new ScoutEntity();
    scout.id = this.generateId();
    scout.creator = input.creator.trim();
    scout.title = input.title.trim();
    scout.body = input.body.trim();
    scout.status = input.status?.trim() || 'DRAFT';

    return this.scoutRepository.save(scout);
  }

  async updateStatus(id: string, status: string): Promise<ScoutEntity> {
    const result = await this.scoutRepository.updateStatus(id, status);
    if (!result) {
      throw new NotFoundException('対象のスカウト文が見つかりません');
    }
    return result;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  }
}
