import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { JobSummary } from '../../../core/interfaces/job';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { PagedResponse } from '../../../core/interfaces/pagedResponse';
import { JobCardComponent } from '../../../components/job-card/job-card.component';


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

	private _jobService: JobService = inject(JobService);
	private _spinner: NgxSpinnerService = inject(NgxSpinnerService);

	visibleJobsLimit = 5;

	private _jobs: BehaviorSubject<JobSummary[]> = new BehaviorSubject<JobSummary[]>([]);
	jobs: Observable<JobSummary[]> = this._jobs.asObservable();
	private _currentPage: number = 1;
	private _pageSize: number = 10;
	private _totalPages: number = 0;
	protected _totalCount: number = 0;
	private _hasNext: boolean = true;
	private _hasPrevious: boolean = false;

	load_saved_jobs(): void {
		if (!this._hasNext) {
			return;
		}
		this._spinner.show();
		this._jobService.get_saved_jobs(this._currentPage, this._pageSize).subscribe({
			next: (response: PagedResponse<JobSummary>) => {
				this._jobs.next([...this._jobs.value, ...response.items]);
				console.log(response);
				this._spinner.hide();
				this._currentPage = response.pageNumber;
				this._totalPages = response.totalPages;
				this._totalCount = response.totalCount;
				this._hasNext = response.hasNextPage;
				this._hasPrevious = response.hasPreviousPage;
			},
			error: () => {
				this._hasNext = false;
				this._spinner.hide();
			}
		});
	}

	ngOnInit(): void {
		this.load_saved_jobs();
	}
}
