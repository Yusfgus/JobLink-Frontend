import { UserRole } from "./UserRole";


export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expires: Date;
    role: UserRole;
}


