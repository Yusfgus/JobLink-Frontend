import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

	if (req.url.includes('/auth/')) {
		return next(req);
	}

	const authService = inject(AuthService);

	const addToken = (request: any, token: string) =>
		request.clone({
			setHeaders: { Authorization: `Bearer ${token}` }
		});

	const token = authService.getAccessToken();

	// Attach token
	if (token) {
		req = addToken(req, token);
	}

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			// If unauthorized → try refresh
			if (error.status === 401) {
				const refreshToken = authService.getRefreshToken();

				if (!refreshToken) {
					authService.logout();
					return throwError(() => error);
				}

				return authService.refresh().pipe(
					switchMap((res) => {
						authService.setToken(res);

						// Retry original request with new token
						const newReq = addToken(req, res.accessToken);
						return next(newReq);
					}),
					catchError(err => {
						authService.logout();
						return throwError(() => err);
					})
				);
			}

			return throwError(() => error);
		})
	);
};