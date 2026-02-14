import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../prisma/security.service';

@Injectable()
export class CasesService {
  constructor(
    private prisma: PrismaService,
    private security: SecurityService,
  ) {}

  async create(dto: any, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const newCase = await tx.case.create({
        data: {
          title: dto.title,
          description: dto.description,
          category: dto.category,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'CASE_FILED',
          userId: userId,
          targetId: newCase.id,
          newValue: `Title: ${dto.title}`,
          hash: this.security.signLog('CASE_FILED', userId, newCase.id),
        },
      });

      return newCase;
    });
  }

  // Added back to fix controller error
  async getPendingCases(lawyerId: string) {
    return this.prisma.case.findMany({
      where: { status: 'PENDING' },
    });
  }

  // Added back to fix controller error
  async updateCaseStatus(caseId: string, status: string) {
    return this.prisma.case.update({
      where: { id: caseId },
      data: { status },
    });
  }
}