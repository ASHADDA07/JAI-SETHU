import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // REGISTER
  async register(dto: any) {
    // 1. Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already exists');

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Create User
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role: dto.role.toUpperCase(), // Ensure role matches Enum (PUBLIC, LAWYER, etc.)
        avatar: '',
      },
    });

    return this.signToken(user.id, user.email, user.role);
  }

  // LOGIN (With Debug Logs)
  async login(dto: any) {
    console.log('🔍 Login Attempt:', dto.email); 

    // 1. Find User
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      console.log('❌ User not found in DB'); 
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Check Password
    const pwMatches = await bcrypt.compare(dto.password, user.password);
    if (!pwMatches) {
      console.log('❌ Password mismatch'); 
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Check Role
    const inputRole = dto.role ? dto.role.toUpperCase() : user.role;
    
    if (user.role !== inputRole) {
       console.log(`❌ Role Mismatch: DB says ${user.role}, Input says ${inputRole}`);
       throw new UnauthorizedException('Wrong portal. Please login as ' + user.role);
    }

    console.log('✅ Login Successful');
    return this.signToken(user.id, user.email, user.role);
  }

  // HELPER: Sign Token
  async signToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET || 'super-secret',
    });

    return {
      access_token: token,
      user: {
        id: userId,
        email: email,
        role: role,
        fullName: '', // Add fields as needed
      }
    };
  }
}