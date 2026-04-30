import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/abstractions/job';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { JobCardComponent } from '../../../components/job-card/job-card.component';
import { ToastService } from '../../../core/services/toast.service';
import { JobService } from '../../../core/services/job.service';
import { SavedJobService } from '../../../core/services/savedJob.service';
import { ApplicationsService } from '../../../core/services/applications.service';

import { PaginatorModule } from 'primeng/paginator';

interface PageEvent {
	first: number;
	rows: number;
	page: number;
	pageCount: number;
}

@Component({
	selector: 'app-saved-jobs',
	standalone: true,
	imports: [
		CommonModule,
		JobCardComponent,
		PaginatorModule,
	],
	templateUrl: './saved-jobs.component.html',
	styleUrl: './saved-jobs.component.scss'
})
export class SavedJobsComponent {

	private _jobService: JobService = inject(JobService);
	protected _savedJobService: SavedJobService = inject(SavedJobService);
	private _applicationService: ApplicationsService = inject(ApplicationsService);
	private _spinner: NgxSpinnerService = inject(NgxSpinnerService);
	private _toastService: ToastService = inject(ToastService);

	first: number = 0;
	rows: number = 1;

	onPageChange(event: any) {
		console.log(event);
		this.first = event.first;
		this.rows = event.rows;

		this.loadMore(event.page + 1, this.rows);
	}

	savedJobs: Observable<Job[]> = this._savedJobService.savedJobs$;

	ngOnInit(): void {
		console.log("saved-job-component ogOnInit");
		this.loadMore(1, this.rows);
	}

	loadMore(pageNumber: number, pageSize: number): void {
		this._spinner.show();
		this._savedJobService.loadSavedJob(pageNumber, pageSize);
		this._spinner.hide();
	}

	onApply(job: Job): void {
		this._spinner.show();
		this._applicationService.applyForJob(job).subscribe({
			next: () => {
				this._toastService.success('Success', 'Job applied successfully');
				this._jobService.updateAppliedStatus(job.id, true);
			},
			error: (error) => {
				this._toastService.error('Error', error.error.detail || 'Failed to apply for job');
			}
		}).add(() => {
			this._spinner.hide();
		});
	}

	onBookmarkClick(job: Job): void {
		this._savedJobService.unsave_job(job).subscribe({
			next: () => {
				this._toastService.success('Success', 'Job unsaved successfully');
				this._jobService.updateSavedStatus(job.id, false);
			},
			error: (error) => {
				this._toastService.error('Error', error.error.detail || 'Failed to unsave job');
			}
		})
	}
}
