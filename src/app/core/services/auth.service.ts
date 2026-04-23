import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Login } from '../interfaces/login';
import { JobseekerRegister } from '../interfaces/jobseeker-register';
import { TokenResponse } from '../interfaces/token-response';
import { EmployerRegister } from '../interfaces/employer-register';

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

  refresh(refreshToken: string): Observable<any> {
    return this._httpClient.post(`${environment.apiRootUrl}/auth/refresh-token`, { refreshToken: refreshToken })
  }

  logout(): Observable<any> {
    this.removeToken();
    return this._httpClient.post(`${environment.apiRootUrl}/auth/logout`, null)

    // this._httpClient.post(`${environment.apiRootUrl}/auth/logout`, null)
    //   .subscribe({
    //     next: _ => {
    //       this.removeToken();
    //     },
    //     error: error => {
    //       console.log(error)
    //     }
    //   })
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') != null;
  }

  setToken(tokenResponse: TokenResponse): void {
    localStorage.setItem('accessToken', tokenResponse.accessToken)
    localStorage.setItem('refreshToken', tokenResponse.refreshToken)
    localStorage.setItem('expiresOnUtc', tokenResponse.expires.toString())
  }

  setRole(role: string): void {
    localStorage.setItem('role', role)
  }

  removeToken(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiresOnUtc')
    localStorage.removeItem('role')
  }

  getAccessToken(): string {
    return localStorage.getItem('accessToken') || '';
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken') || '';
  }

  getExpiresOnUtc(): string {
    return localStorage.getItem('expiresOnUtc') || '';
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  isTokenExpired(): boolean {
    const expiresOnUtc = this.getExpiresOnUtc();
    if (!expiresOnUtc) return true;
    const expiresOn = new Date(expiresOnUtc);
    return expiresOn < new Date();
  }
}
