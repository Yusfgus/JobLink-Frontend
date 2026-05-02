import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application } from '../../../core/abstractions/job';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { JobService } from '../../../core/services/job.service';
import { SavedJobService } from '../../../core/services/savedJob.service';
import { ApplicationsService } from '../../../core/services/applications.service';
import { ApplicationCardComponent } from '../../../components/application-card/application-card.component';

import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CommonModule,
    ApplicationCardComponent,
    PaginatorModule,
  ],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {

  private _jobService: JobService = inject(JobService);
  protected _savedJobService: SavedJobService = inject(SavedJobService);
  protected _applicationService: ApplicationsService = inject(ApplicationsService);
  private _spinner: NgxSpinnerService = inject(NgxSpinnerService);
  private _toastService: ToastService = inject(ToastService);

  first: number = 0;
  rows: number = 10;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;

    this.loadMore(event.page + 1, this.rows);
  }

  applications: Observable<Application[]> = this._applicationService.applications$;

  ngOnInit(): void {
    this.loadMore(1, this.rows);
  }

  loadMore(pageNumber: number, pageSize: number): void {
    this._spinner.show();
    this._applicationService.loadApplications(pageNumber, pageSize);
    this._spinner.hide();
  }

  onWithdraw(application: Application): void {
    this._spinner.show();
    this._applicationService.withdrawApplication(application).subscribe({
      next: () => {
        this._toastService.success('Success', 'Application withdrawn successfully');
        this._jobService.updateAppliedStatus(application.jobId, false);
        this._savedJobService.updateAppliedStatus(application.jobId, false);
      },
      error: (error) => {
        this._toastService.error('Error', error.error.detail || 'Failed to withdraw application');
      }
    })
      .add(() => {
        this._spinner.hide();
      });
  }
}
