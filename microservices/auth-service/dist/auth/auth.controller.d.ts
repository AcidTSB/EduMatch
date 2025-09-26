import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, FirebaseLoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            status: any;
            subscriptionType: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            subscriptionType: import(".prisma/client").$Enums.SubscriptionType;
        };
    }>;
    firebaseLogin(firebaseLoginDto: FirebaseLoginDto): Promise<void>;
    refresh(req: any): Promise<{
        access_token: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
