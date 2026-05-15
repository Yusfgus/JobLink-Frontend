import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from './core/services/auth.service';
import { JobSeekerService } from './core/services/jobseeker.service';
import { catchError, firstValueFrom, forkJoin, of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    MessageService,
    ConfirmationService,
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
