import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { UserRole } from "../abstractions/user-role";

export const authGuard = (role: UserRole, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const platformId = inject(PLATFORM_ID);

	// Skip guard on server
	if (!isPlatformBrowser(platformId)) {
		return true;
	}

	const authService = inject(AuthService);
	const router = inject(Router);

	const redirectToLogin = () =>
		router.createUrlTree(['/auth/login'], {
			queryParams: { returnUrl: state.url }
		});

	if (!authService.isLoggedIn())
		return redirectToLogin();

	if (authService.getRole() !== role)
		return redirectToLogin();

	return true;
};

export const jobSeekerAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	return authGuard(UserRole.JobSeeker, route, state);
};

export const employerAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	return authGuard(UserRole.Company, route, state);
};