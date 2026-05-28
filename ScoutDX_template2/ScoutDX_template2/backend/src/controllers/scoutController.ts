import { Body, Controller, Get, Post } from '@nestjs/common';
import { AiService } from '../services/aiService';
import { ScoutService } from '../services/scoutService';
import { ScoutEntity } from '../types';

@Controller('api/scouts')
export class ScoutController {
  constructor(
    private readonly scoutService: ScoutService,
    private readonly aiService: AiService,
  ) {}

  @Get()
  findAll() {
    return this.scoutService.findAll();
  }

  @Post()
  create(@Body() body: ScoutEntity) {
    return this.scoutService.create(body);
  }

  @Get('generate')
  generate() {
    return this.aiService.getSample();
  }
}
