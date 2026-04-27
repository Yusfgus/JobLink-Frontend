import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { JobCard, JobSummary, SavedJob } from '../../core/interfaces/job';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-job-card',
    standalone: true,
    imports: [CommonModule, ButtonModule, ConfirmPopupModule],
    templateUrl: './job-card.component.html',
    styleUrl: './job-card.component.scss'
})
export class JobCardComponent {
    constructor(
        private _jobService: JobService,
        private _toastService: ToastService,
        private confirmationService: ConfirmationService
    ) { }

    @Input({ required: true }) job!: JobCard;
    @Input({ required: false }) isSavedJob: boolean = false;

    _isSaved!: boolean;

    ngOnInit(): void {
        console.log('the saved job', this.job);
        console.log('job id', this.job.id);
        this._isSaved = this.isSavedJob ? true : (this.job as JobSummary).isSaved;
        console.log('job id', this.job.id);
    }

    onApply(): void {
        if (this.job.isApplied) {
            return;
        }
        this._jobService.apply_for_job(this.job.id).subscribe({
            next: () => {
                this.job.isApplied = true;
                this._toastService.success('Success', 'Job applied successfully');
            },
            error: (error) => {
                this._toastService.error('Error', error.error.detail || 'Failed to apply for job');
            }
        });
    }

    onBookmark(event: Event): void {
        if (this._isSaved) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Are you sure you want to unsave this job?',
                header: 'Confirm',
                acceptLabel: 'Unsave',
                rejectLabel: 'Cancel',
                blockScroll: true,
                acceptButtonStyleClass: 'p-button-danger',
                accept: () => {
                    this.unsave_job();
                },
            });
        } else {
            this.save_job();
        }
    }

    save_job(): void {
        this._jobService.save_job(this.job.id).subscribe({
            next: () => {
                if (!this.isSavedJob) {
                    // add to saved jobs list
                }
                this._toastService.success('Success', 'Job saved successfully');
                this._isSaved = true;
            },
            error: (error) => {
                this._toastService.error('Error', error.error.detail || 'Failed to save job');
            }
        });
    }

    unsave_job(): void {
        this._jobService.unsave_job(this.job.id).subscribe({
            next: () => {
                if (this.isSavedJob) {
                    // remove from saved jobs list
                }
                this._toastService.success('Success', 'Job unsaved successfully');
                this._isSaved = false;
            },
            error: (error) => {
                this._toastService.error('Error', error.error.detail || 'Failed to unsave job');
            }
        });
    }
}
