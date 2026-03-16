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

  // ✅ Upgraded updateUser function to handle related tables securely
  async updateUser(id: string, data: any) {
    const { 
      fullName, phone, location, 
      barEnrollmentNo, practicingCourt, specialization, 
      university, year 
    } = data;

    return this.prisma.user.update({
      where: { id },
      data: {
        fullName,
        phone,
        location,
        // If it's a lawyer, update or create their lawyer profile
        ...(barEnrollmentNo && {
          lawyerProfile: {
            upsert: {
              create: { barEnrollmentNo, practicingCourt, specialization },
              update: { barEnrollmentNo, practicingCourt, specialization }
            }
          }
        }),
        // If it's a student, update or create their student profile
        ...(university && {
          studentProfile: {
            upsert: {
              create: { university, year: String(year) },
              update: { university, year: String(year) }
            }
          }
        })
      },
      // Return the newly updated profile data
      include: {
        lawyerProfile: true,
        studentProfile: true
      }
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