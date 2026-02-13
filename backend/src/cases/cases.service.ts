import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  // 1. Get Pending Cases for a Lawyer
  async getPendingCases(lawyerId: string) {
    return this.prisma.case.findMany({
      where: {
        lawyerId: lawyerId,
        status: 'PENDING',
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 2. Update Case Status
  async updateCaseStatus(caseId: string, status: 'OPEN' | 'CLOSED' | 'ARCHIVED') {
    return this.prisma.case.update({
      where: { id: caseId },
      data: { status },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }
}