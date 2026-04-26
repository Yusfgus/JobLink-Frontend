import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { JobSummary } from '../../core/interfaces/job';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-job-summary',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './job-summary.component.html',
    styleUrl: './job-summary.component.scss'
})
export class JobSummaryComponent {
    constructor(
        private _jobService: JobService,
        private _toastService: ToastService
    ) { }

    @Input({ required: true }) job!: JobSummary;

    @Output() apply = new EventEmitter<JobSummary>();
    @Output() bookmark = new EventEmitter<JobSummary>();

    onApply(): void {
        this._jobService.apply_for_job(this.job.id).subscribe({
            next: () => {
                this.job.isApplied = true;
                this.apply.emit(this.job);
                this._toastService.success('Success', 'Job applied successfully');
            },
            error: (error) => {
                this._toastService.error('Error', error.error.detail || 'Failed to apply for job');
            }
        });
    }

    onBookmark(): void {
        if (this.job.isSaved) {
            this.unsave_job();
        } else {
            this.save_job();
        }
    }

    save_job(): void {
        this._jobService.save_job(this.job.id).subscribe({
            next: () => {
                this.job.isSaved = true;
                this.bookmark.emit(this.job);
                this._toastService.success('Success', 'Job saved successfully');
            },
            error: (error) => {
                this._toastService.error('Error', error.error.detail || 'Failed to save job');
            }
        });
    }

    unsave_job(): void {
        this._jobService.unsave_job(this.job.id).subscribe({
            next: () => {
                this.job.isSaved = false;
                this.bookmark.emit(this.job);
                this._toastService.success('Success', 'Job unsaved successfully');
            },
            error: (error) => {
                this._toastService.error('Error', error.error.detail || 'Failed to unsave job');
            }
        });
    }
}
