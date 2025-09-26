import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    updateProfile(userId: string, profileData: any): Promise<any>;
}
