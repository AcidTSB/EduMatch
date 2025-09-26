export declare class AuthService {
    validateToken(token: string): Promise<any>;
    extractUserFromRequest(req: any): Promise<any>;
}
