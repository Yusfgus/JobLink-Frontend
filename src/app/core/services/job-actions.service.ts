import { inject, Injectable } from "@angular/core";
import { Job } from '../../core/abstractions/job';
import { JobService } from '../../core/services/job.service';
import { SavedJobService } from '../../core/services/savedJob.service';
import { ApplicationsService } from '../../core/services/applications.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../core/services/toast.service';

@Injectable({
    providedIn: 'root'
})
export class JobActionsService {
    protected _jobService: JobService = inject(JobService);
    private _savedJobService: SavedJobService = inject(SavedJobService);
    private _applicationService: ApplicationsService = inject(ApplicationsService);
    private _spinner: NgxSpinnerService = inject(NgxSpinnerService);
    private _toastService: ToastService = inject(ToastService);

    apply(job: Job): void {
        this._spinner.show();
        this._applicationService.applyForJob(job).subscribe({
            next: () => {
                this._toastService.success('Success', 'Job applied successfully');
                this._jobService.updateAppliedStatus(job.id, true);
                this._savedJobService.updateAppliedStatus(job.id, true);
            },
            error: (error) => {
                this._toastService.error('Error', error.error.detail || 'Failed to apply for job');
            }
        }).add(() => {
            this._spinner.hide();
        });
    }

    save(job: Job): void {
        this._savedJobService.saveJob(job).subscribe({
            next: () => {
                this._toastService.success('Success', 'Job saved successfully');
                this._jobService.updateSavedStatus(job.id, true);
            },
            error: (error) => {
                this._toastService.error('Error', error.error.detail || 'Failed to save job');
            }
        });
    }

    unsave(job: Job): void {
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