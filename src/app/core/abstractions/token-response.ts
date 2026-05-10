import { UserRole } from "./user-role";


export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresUtc: Date;
    role: UserRole;
}


