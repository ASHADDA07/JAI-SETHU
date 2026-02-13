import { Controller, Get, Patch, Param, Body, Query, BadRequestException } from '@nestjs/common';
import { CasesService } from './cases.service';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get('pending')
  async getPendingCases(@Query('lawyerId') lawyerId: string) {
    if (!lawyerId) throw new BadRequestException('lawyerId is required');
    return this.casesService.getPendingCases(lawyerId);
  }

  @Patch(':id/status')
  async updateCaseStatus(
    @Param('id') caseId: string,
    @Body() body: { status: 'OPEN' | 'CLOSED' | 'ARCHIVED' },
  ) {
    return this.casesService.updateCaseStatus(caseId, body.status);
  }
}