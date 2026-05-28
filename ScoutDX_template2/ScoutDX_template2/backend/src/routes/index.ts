import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalController } from '../controllers/approvalController';
import { AuthController } from '../controllers/authController';
import { ScoutController } from '../controllers/scoutController';
import { DatabaseRepository } from '../repositories/database';
import { AiService } from '../services/aiService';
import { AuthService } from '../services/authService';
import { ScoutService } from '../services/scoutService';
import { ScoutEntity } from '../types';

@Module({
  imports: [TypeOrmModule.forFeature([ScoutEntity])],
  controllers: [AuthController, ScoutController, ApprovalController],
  providers: [AuthService, ScoutService, DatabaseRepository, AiService],
})
export class RoutesModule {}
