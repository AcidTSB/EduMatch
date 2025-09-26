import { Strategy } from 'passport-custom';
import { PrismaService } from '../../prisma/prisma.service';
declare const FirebaseStrategy_base: new (...args: any[]) => Strategy;
export declare class FirebaseStrategy extends FirebaseStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(req: any): Promise<any>;
    private extractTokenFromHeader;
}
export {};
