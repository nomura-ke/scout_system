import { Controller, Param, Patch } from '@nestjs/common';
import { ScoutService } from '../services/scoutService';

@Controller('api/approvals')
export class ApprovalController {
  constructor(private readonly scoutService: ScoutService) {}

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.scoutService.updateStatus(id, 'APPROVED');
  }

  @Patch(':id/remand')
  remand(@Param('id') id: string) {
    return this.scoutService.updateStatus(id, 'REMANDED');
  }
}
