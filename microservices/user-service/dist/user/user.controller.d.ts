import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    updateProfile(id: string, profileData: any): Promise<any>;
}
