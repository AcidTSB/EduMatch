import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PrismaService } from '../../prisma/prisma.service';
// import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(private prisma: PrismaService) {
    super();
  }

  async validate(req: any): Promise<any> {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('No Firebase token provided');
    }

    try {
      // TODO: Implement Firebase token validation
      // const decodedToken = await admin.auth().verifyIdToken(token);
      // let user = await this.usersService.findByFirebaseUid(decodedToken.uid);
      
      // if (!user) {
      //   // Create user if doesn't exist
      //   user = await this.usersService.createFromFirebase(decodedToken);
      // }

      // return user;
      
      // For now, return mock implementation
      throw new UnauthorizedException('Firebase authentication not implemented yet');
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
