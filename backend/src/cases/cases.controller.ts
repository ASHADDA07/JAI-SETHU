import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CasesService } from './cases.service';
// Updated this path - check if your guard is in 'src/auth/jwt-auth.guard.ts' instead
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCaseDto: any, @Request() req: any) {
    return this.casesService.create(createCaseDto, req.user.userId);
  }

  @Get('pending/:lawyerId')
  getPending(@Param('lawyerId') lawyerId: string) {
    return this.casesService.getPendingCases(lawyerId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') caseId: string, @Body() body: { status: string }) {
    return this.casesService.updateCaseStatus(caseId, body.status);
  }
}