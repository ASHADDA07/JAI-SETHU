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
      // 1. Create the Case (Using 'connect' to link User)
      const newCase = await tx.case.create({
        data: {
          title: dto.title,
          description: dto.description,
          category: dto.category || 'GENERAL',
          status: 'PENDING',
          // FIX: Use 'connect' instead of passing userId directly
          user: {
            connect: { id: userId }
          }
        },
      });

      // 2. Create Audit Log
      await tx.auditLog.create({
        data: {
          action: 'CASE_FILED',
          userId: userId,
          targetId: newCase.id,
          newValue: `Title: ${dto.title}`,
          // Ensure your SecurityService handles nulls if schema doesn't match perfectly
          hash: this.security.signLog('CASE_FILED', userId, newCase.id),
        },
      });

      return newCase;
    });
  }

  async getPendingCases(lawyerId: string) {
    return this.prisma.case.findMany({
      where: { status: 'PENDING' },
    });
  }

  async updateCaseStatus(caseId: string, status: string) {
    return this.prisma.case.update({
      where: { id: caseId },
      data: { status },
    });
  }
}