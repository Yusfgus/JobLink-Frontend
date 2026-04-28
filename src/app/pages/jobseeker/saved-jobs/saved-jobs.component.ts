import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedJobService } from '../../../core/services/savedJob.service';
import { JobCard, SavedJob } from '../../../core/interfaces/job';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { JobCardComponent } from '../../../components/job-card/job-card.component';
import { ToastService } from '../../../core/services/toast.service';


@Component({
	selector: 'app-saved-jobs',
	standalone: true,
	imports: [
		CommonModule,
		JobCardComponent,
	],
	templateUrl: './saved-jobs.component.html',
	styleUrl: './saved-jobs.component.scss'
})
export class SavedJobsComponent {

	private _savedJobsService: SavedJobService = inject(SavedJobService);
	private _spinner: NgxSpinnerService = inject(NgxSpinnerService);
	private _toastService: ToastService = inject(ToastService);

	visibleJobsLimit = 5;

	savedJobs: Observable<SavedJob[]> = this._savedJobsService.savedJobs;

	ngOnInit(): void {
		console.log("saved-job-component ogOnInit");
		this.loadMore(1, 5);
	}

	loadMore(pageNumber: number, pageSize: number): void {
		this._spinner.show();
		this._savedJobsService.load_saved_jobs(pageNumber, pageSize);
		this._spinner.hide();
	}

	onApply(job: JobCard): void {
		this._spinner.show();
		this._savedJobsService.apply_for_job(job.id).subscribe({
			next: () => {
				job.isApplied = true;
				this._toastService.success('Success', 'Job applied successfully');
			},
			error: (error) => {
				this._toastService.error('Error', error.error.detail || 'Failed to apply for job');
			}
		}).add(() => {
			this._spinner.hide();
		});
	}

	onBookmarkClick(job: JobCard) {
		this._savedJobsService.unsave_job(job.id).subscribe({
			next: () => {
				this._toastService.success('Success', 'Job unsaved successfully');
			},
			error: (error) => {
				this._toastService.error('Error', error.error.detail || 'Failed to unsave job');
			}
		});
	}
}
