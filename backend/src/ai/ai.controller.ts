import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('draft')
  async generateLegalDraft(
    @Body('docType') docType: string,
    @Body('clientName') clientName: string,
    @Body('opposingParty') opposingParty: string,
    @Body('facts') facts: string,
  ) {
    return this.aiService.generateDraft(docType, clientName, opposingParty, facts);
  }
}