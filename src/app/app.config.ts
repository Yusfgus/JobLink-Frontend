import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MessageService, ConfirmationService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
	providers: [
		provideClientHydration(),
		provideAnimations(),
		provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
		MessageService,
		ConfirmationService,
		provideRouter(
			routes,
			withInMemoryScrolling({
				scrollPositionRestoration: 'top'
			})
		)
		// {
		//   provide: APP_INITIALIZER,
		//   multi: true,
		//   useFactory: (authService: AuthService, jobSeekerService: JobSeekerService) => {
		//     return () => {
		//       if (authService.isLoggedIn()) {
		//         return firstValueFrom(
		//           forkJoin([
		//             authService.loadCurrentUser().pipe(catchError(() => of(null))),
		//             jobSeekerService.loadJobSeekerProfile().pipe(catchError(() => of(null))),
		//             jobSeekerService.loadProfilePicture().pipe(catchError(() => of(null)))
		//           ])
		//         );
		//       }
		//       return Promise.resolve();
		//     };
		//   },
		//   deps: [AuthService, JobSeekerService]
		// }
	]
};
