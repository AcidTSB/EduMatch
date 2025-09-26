import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.passwordHash && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        subscriptionType: user.subscriptionType,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        passwordHash,
        role: registerDto.role,
        status: 'PENDING_VERIFICATION',
      },
    });

    // Create profile
    await this.prisma.profile.create({
      data: {
        userId: user.id,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      },
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        subscriptionType: user.subscriptionType,
      },
    };
  }

  async loginWithFirebase(firebaseToken: string) {
    // Firebase token validation logic here
    // This would integrate with Firebase Admin SDK
    throw new Error('Firebase authentication not implemented yet');
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(userId: string) {
    // In a real application, you might want to blacklist the token
    // or implement token revocation
    return { message: 'Logged out successfully' };
  }
}
