import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

export type UserRole = 'SCOUT_USER' | 'SALES_LEADER';

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export interface RoleSelectRequest {
  role: UserRole;
}

@Entity('scouts')
export class ScoutEntity {
  @PrimaryColumn({ name: 'id' })
  id?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @Column({ name: 'creator', type: 'varchar', length: 100 })
  creator: string;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'body', type: 'text' })
  body: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'DRAFT' })
  status: string;
}
