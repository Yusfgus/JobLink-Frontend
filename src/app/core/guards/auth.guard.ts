import { inject } from "@angular/core";
import { CanActivateFn, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { catchError, map, of } from "rxjs";
import { TokenResponse } from "../abstractions/token-response";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	const redirectToLogin = () =>
		router.createUrlTree(['/auth/login'], {
			queryParams: { returnUrl: state.url }
		});

	const accessToken = authService.getAccessToken();

	// No token
	if (!accessToken) {
		return redirectToLogin();
	}

	return true;

	// // Token valid
	// if (authService.isTokenValid()) {
	// 	return true;
	// }

	// // Expired token → try refresh
	// const refreshToken = authService.getRefreshToken();

	// if (!refreshToken) {
	// 	authService.removeToken();
	// 	return redirectToLogin();
	// }

	// // Try refresh
	// return authService.refresh().pipe(
	// 	map((tokenResponse: TokenResponse) => {
	// 		authService.setToken(tokenResponse);
	// 		return true;
	// 	}),
	// 	catchError(() => {
	// 		authService.removeToken();
	// 		return of(redirectToLogin());
	// 	})
	// );
};