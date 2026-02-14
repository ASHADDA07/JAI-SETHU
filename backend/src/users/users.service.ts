import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { 
        lawyerProfile: true, 
        studentProfile: true 
      } 
    });
  }

  async findLawyers() {
    return this.prisma.user.findMany({
      where: { role: 'LAWYER' },
      include: { lawyerProfile: true },
    });
  }

  async findAssociates(excludeUserId?: string) {
    return this.prisma.user.findMany({
      where: {
        role: { in: ['STUDENT', 'LAWYER'] },
        ...(excludeUserId && { id: { not: excludeUserId } }),
      },
      select: {
        id: true, fullName: true, email: true, role: true, avatar: true,
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async updateUser(id: string, data: any) {
    const { 
      barLicenseNo, specialization, courtJurisdiction, 
      university, yearOfStudy, studentIdCard, 
      ...userFields 
    } = data;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userFields,
        lawyerProfile: (barLicenseNo || specialization || courtJurisdiction) ? {
          upsert: {
            create: {
              barLicenseNo: barLicenseNo || '',
              specialization: specialization || [],
              courtJurisdiction: courtJurisdiction || []
            },
            update: {
              barLicenseNo: barLicenseNo,
              specialization: specialization,
              courtJurisdiction: courtJurisdiction
            }
          }
        } : undefined,
        studentProfile: (university || yearOfStudy) ? {
          upsert: {
            create: {
              university: university || '',
              yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : 1
            },
            update: {
              university: university,
              yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : undefined
            }
          }
        } : undefined,
      },
      include: { lawyerProfile: true, studentProfile: true }
    });
  }

  async findAllLawyers(query?: string) {
    return this.prisma.user.findMany({
      where: {
        role: 'LAWYER',
        OR: [
          { fullName: { contains: query || '', mode: 'insensitive' } },
        ]
      },
      include: {
        lawyerProfile: true 
      }
    });
  }
}