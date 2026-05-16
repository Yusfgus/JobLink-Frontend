import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/abstractions/job';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { JobCardComponent } from '../../../components/job-card/job-card.component';
import { SavedJobService } from '../../../core/services/jobs/saved-jobs.service';
import { PaginatorModule } from 'primeng/paginator';


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

	protected _savedJobService: SavedJobService = inject(SavedJobService);
	private _spinner: NgxSpinnerService = inject(NgxSpinnerService);

	first: number = 0;
	rows: number = 10;

	onPageChange(event: any) {
		this.first = event.first;
		this.rows = event.rows;

		this.loadMore(event.page + 1, this.rows);
	}

	savedJobs: Observable<Job[]> = this._savedJobService.savedJobs$;

	ngOnInit(): void {
		this.loadMore(1, this.rows);
	}

	loadMore(pageNumber: number, pageSize: number): void {
		this._spinner.show();
		this._savedJobService.loadSavedJob(pageNumber, pageSize);
		this._spinner.hide();
	}
}
