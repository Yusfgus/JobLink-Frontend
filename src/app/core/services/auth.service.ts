import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Login } from '../abstractions/login';
import { JobseekerRegister } from '../abstractions/jobseeker-register';
import { TokenResponse } from '../abstractions/token-response';
import { EmployerRegister } from '../abstractions/employer-register';
import { UserRole } from '../abstractions/user-role';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private _httpClient: HttpClient, private _storageService: StorageService) { }

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
		return this.getAccessToken() != null;
	}

	setToken(tokenResponse: TokenResponse): void {
		const expires = new Date(tokenResponse.expires);
		this._storageService.set('accessToken', tokenResponse.accessToken)
		this._storageService.set('refreshToken', tokenResponse.refreshToken)
		this._storageService.set('expiresOnUtc', expires.toString())
		this._storageService.set('role', tokenResponse.role.toString())
	}

	removeToken(): void {
		this._storageService.remove('accessToken')
		this._storageService.remove('refreshToken')
		this._storageService.remove('expiresOnUtc')
		this._storageService.remove('role')
	}

	getAccessToken(): string | null {
		return this._storageService.get('accessToken');
	}

	getRefreshToken(): string | null {
		return this._storageService.get('refreshToken');
	}

	getExpiresOnUtc(): string | null {
		return this._storageService.get('expiresOnUtc');
	}

	getRole(): UserRole | null {
		const role = this._storageService.get('role') as UserRole;
		return role;
	}

	isJobSeeker(): boolean {
		return this.getRole() === UserRole.JobSeeker;
	}

	isEmployer(): boolean {
		return this.getRole() === UserRole.Company;
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
