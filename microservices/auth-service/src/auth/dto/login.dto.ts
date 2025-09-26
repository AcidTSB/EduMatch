import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  PROVIDER = 'PROVIDER',
  UNIVERSITY = 'UNIVERSITY',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

export class FirebaseLoginDto {
  @ApiProperty({ example: 'firebase_token_here' })
  @IsString()
  @IsNotEmpty()
  firebaseToken: string;
}
