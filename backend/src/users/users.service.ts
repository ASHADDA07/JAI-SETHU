import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. Create a new User (Sign Up)
  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  // 2. Find User by Email (Login)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { 
        lawyerProfile: true, 
        studentProfile: true 
      } 
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

  // 3. Update User AND Their Specific Profile
  async updateUser(id: string, data: any) {
    // Separate User fields from Profile fields
    const { 
      barLicenseNo, specialization, courtJurisdiction, // Lawyer fields
      university, yearOfStudy, studentIdCard,          // Student fields
      ...userFields                                    // Standard fields (Name, Email)
    } = data;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userFields, // Update Name/Email
        
        // If it's a LAWYER, update the LawyerProfile too
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

        // If it's a STUDENT, update the StudentProfile too
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
      include: { lawyerProfile: true, studentProfile: true } // Return the full updated object
    });
  }

  // 4. Find Lawyers (Marketplace Search)
  async findAllLawyers(query?: string) {
    return this.prisma.user.findMany({
      where: {
        role: 'LAWYER', // Only fetch lawyers
        OR: [
          { fullName: { contains: query || '', mode: 'insensitive' } }, // Search by Name
          // Note: searching nested relations (lawyerProfile) is more complex in Prisma
          // For now, we search just by Name to keep it simple and working.
        ]
      },
      include: {
        lawyerProfile: true 
      }
    });
  }
}