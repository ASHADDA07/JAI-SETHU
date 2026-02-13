import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    let userRole: 'PUBLIC' | 'LAWYER' | 'STUDENT' = 'PUBLIC';
    if (dto.role) {
      const upperRole = dto.role.toUpperCase();
      if (upperRole === 'LAWYER') userRole = 'LAWYER';
      else if (upperRole === 'STUDENT') userRole = 'STUDENT';
    }

    const data: any = {
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: userRole,
    };

    // Use Timestamp to guarantee unique License on registration
    if (userRole === 'LAWYER') {
      data.lawyerProfile = { 
        create: {
           barLicenseNo: `PENDING_${Date.now()}`, 
           specialization: [],
           courtJurisdiction: []
        } 
      };
    }

    if (userRole === 'STUDENT') {
      data.studentProfile = { 
        create: {
          university: "Not Provided",
          yearOfStudy: 1
        } 
      };
    }

    const user = await this.prisma.user.create({ data });

    return { message: 'User registered successfully', userId: user.id };
  }

  async login(dto: LoginDto) {
    // 1. Fetch User AND their Profile Data (This was missing before)
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        lawyerProfile: true, // <--- IMPORTANT: Include Lawyer Data
        studentProfile: true // <--- IMPORTANT: Include Student Data
      }
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role.toLowerCase() 
    };
    
    // 2. Return a complete User Object to Frontend
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role.toLowerCase(),
        avatar: user.avatar,
        // Send specific profile data if it exists
        barLicenseNo: user.lawyerProfile?.barLicenseNo || null,
        university: user.studentProfile?.university || null
      }
    };
  }
}