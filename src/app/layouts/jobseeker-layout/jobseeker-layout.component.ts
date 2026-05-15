import { Component } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { JobseekerHeaderComponent } from '../../components/jobseeker-header/jobseeker-header.component'
import { AuthFooterComponent } from "../../components/auth-footer/auth-footer.component";
import { AuthService } from '../../core/services/auth.service';
import { JobSeekerService } from '../../core/services/jobseeker.service';
import { ToastService } from '../../core/services/toast.service';
import { ApiErrorResponse } from '../../core/abstractions/response';

@Component({
	selector: 'app-jobseeker-layout',
	standalone: true,
	imports: [RouterOutlet, JobseekerHeaderComponent, AuthFooterComponent],
	templateUrl: './jobseeker-layout.component.html',
	styleUrl: './jobseeker-layout.component.scss'
})
export class JobseekerLayoutComponent {
	constructor(
		private authService: AuthService,
		private jobSeekerService: JobSeekerService,
		private router: Router,
		private toastService: ToastService
	) {
		if (this.authService.isLoggedIn()) {
			this.authService.loadCurrentUser().subscribe({
				next: () => {
					this.jobSeekerService.loadJobSeekerProfile().subscribe();
					this.jobSeekerService.loadProfilePicture().subscribe();
				},
				error: (error: ApiErrorResponse) => {
					this.toastService.error(error.title, error.detail);
					this.authService.logout().subscribe({
						next: () => {
							this.router.navigate(['/auth/welcome']);
						}
					});
				}
			});
		}
	}
}
