import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScoutEntity } from '../types';

@Injectable()
export class DatabaseRepository {
  constructor(
    @InjectRepository(ScoutEntity)
    private readonly repository: Repository<ScoutEntity>,
  ) {}

  async findAll(): Promise<ScoutEntity[]> {
    // 直接SQL文を発行する
    return this.repository.query(
      'SELECT * FROM scouts ORDER BY created_at DESC'
    );
  }

  async save(scout: ScoutEntity): Promise<ScoutEntity> {
    // 直接SQL文でINSERTする
    await this.repository.query(
      `INSERT INTO scouts (id, creator, title, body, status) VALUES ($1, $2, $3, $4, $5)`,
      [scout.id, scout.creator, scout.title, scout.body, scout.status]
    );
    // 直後のエンティティを返す
    const rows = await this.repository.query(
      `SELECT * FROM scouts WHERE id = $1`,
      [scout.id]
    );
    if (rows.length === 0) throw new Error('Scout not found after insert');
    return rows[0];
  }

  async updateStatus(id: string, status: string): Promise<ScoutEntity | null> {
    const rows = await this.repository.query(
      `UPDATE scouts SET status = $2 WHERE id = $1 RETURNING *`,
      [id, status]
    );
    if (rows.length === 0) return null;
    return rows[0];
  }
}
