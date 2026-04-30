import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Login } from '../abstractions/login';
import { JobseekerRegister } from '../abstractions/jobseeker-register';
import { TokenResponse } from '../abstractions/token-response';
import { EmployerRegister } from '../abstractions/employer-register';
import { UserRole } from '../abstractions/user-role';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private _httpClient: HttpClient) { }

	jobseeker_register(registerData: JobseekerRegister): Observable<any> {
		return this._httpClient.post(`${environment.apiRootUrl}/auth/register/job-seeker`, registerData)
	}

	employer_register(registerData: EmployerRegister): Observable<any> {
		return this._httpClient.post(`${environment.apiRootUrl}/auth/register/company`, registerData)
	}

	login(loginData: Login): Observable<any> {
		return this._httpClient.post(`${environment.apiRootUrl}/auth/login`, loginData)
	}

	refresh(): Observable<TokenResponse> {
		const refreshToken = this.getRefreshToken();

		if (!refreshToken)
			return throwError(() => new Error("No refresh token"));

		return this._httpClient.post<TokenResponse>(`${environment.apiRootUrl}/auth/refresh-token`, { refreshToken });
	}

	logout(): Observable<any> {
		return this._httpClient.post(`${environment.apiRootUrl}/auth/logout`, null)
			.pipe(tap(() => {
				this.removeToken();
			}))
	}

	isLoggedIn(): boolean {
		return this.getAccessToken() != null && this.getRefreshToken() != null && this.isTokenValid();
	}

	setToken(tokenResponse: TokenResponse): void {
		const expires = new Date(tokenResponse.expires);
		localStorage.setItem('accessToken', tokenResponse.accessToken)
		localStorage.setItem('refreshToken', tokenResponse.refreshToken)
		localStorage.setItem('expiresOnUtc', expires.toString())
		localStorage.setItem('role', tokenResponse.role.toString())
	}

	removeToken(): void {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('expiresOnUtc')
		localStorage.removeItem('role')
	}

	getAccessToken(): string | null {
		return localStorage.getItem('accessToken');
	}

	getRefreshToken(): string | null {
		return localStorage.getItem('refreshToken');
	}

	getExpiresOnUtc(): string | null {
		return localStorage.getItem('expiresOnUtc');
	}

	getRole(): UserRole | null {
		const role = localStorage.getItem('role') as UserRole;
		return role || null;
	}

	isTokenValid(): boolean {
		const expiresOnUtc = this.getExpiresOnUtc();
		if (expiresOnUtc === null)
			return false;

		const expiresOn = new Date(expiresOnUtc);
		const current = new Date();

		console.log(expiresOn, current);
		return expiresOn > current;
	}
}
