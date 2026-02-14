import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../prisma/security.service'; // Added
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private security: SecurityService, // Added
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let userRole: 'PUBLIC' | 'LAWYER' | 'STUDENT' = 'PUBLIC';
    if (dto.role) {
      const upperRole = dto.role.toUpperCase();
      if (upperRole === 'LAWYER') userRole = 'LAWYER';
      else if (upperRole === 'STUDENT') userRole = 'STUDENT';
    }

    // Prepare Database Transaction to ensure User and AuditLog are created together
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword, // Matches schema field "password"
          fullName: dto.fullName,
          role: userRole,
        },
      });

      // --- CREATE IMMUTABLE AUDIT LOG ---
      await tx.auditLog.create({
        data: {
          action: 'USER_REGISTERED',
          userId: user.id,
          targetId: user.id,
          newValue: `Role: ${userRole}`,
          hash: this.security.signLog('USER_REGISTERED', user.id, user.id),
        },
      });

      return user;
    });

    return { message: 'User registered successfully', userId: result.id };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role.toLowerCase() 
    };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role.toLowerCase(),
      }
    };
  }
}