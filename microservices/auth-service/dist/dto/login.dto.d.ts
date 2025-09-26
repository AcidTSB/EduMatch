export declare class LoginDto {
    email: string;
    password: string;
}
export declare enum UserRole {
    STUDENT = "STUDENT",
    PROVIDER = "PROVIDER",
    UNIVERSITY = "UNIVERSITY",
    PROFESSOR = "PROFESSOR",
    ADMIN = "ADMIN"
}
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}
export declare class FirebaseLoginDto {
    firebaseToken: string;
}
