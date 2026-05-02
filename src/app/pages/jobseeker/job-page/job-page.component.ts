import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../../../core/abstractions/job';
import { JobDetailsComponent } from "../../../components/job-details/job-details.component";
import { JobService } from '../../../core/services/job.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'app-job-page',
	standalone: true,
	imports: [
		CommonModule,
		JobDetailsComponent,
		NgxSpinnerModule
	],
	templateUrl: './job-page.component.html',
	styleUrl: './job-page.component.scss'
})
export class JobPageComponent {
	job: Job | undefined = undefined;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private jobService: JobService,
		private spinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			const id = params.get('id');

			if (!id) {
				this.router.navigate(['/not-found']);
				return;
			}

			this.loadJob(id);
		});
	}

	private loadJob(id: string): void {
		this.spinnerService.show();

		this.jobService.getJobById(id).subscribe({
			next: job => {
				this.job = job;
				this.spinnerService.hide();
			},
			error: err => {
				// console.error("Job Page - Error loading job:", err);
				this.spinnerService.hide();
				this.router.navigate(['/not-found']);
			}
		});
	}
}
