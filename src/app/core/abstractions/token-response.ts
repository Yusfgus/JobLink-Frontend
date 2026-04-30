import { UserRole } from "./user-role";


export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expires: Date;
    role: UserRole;
}


