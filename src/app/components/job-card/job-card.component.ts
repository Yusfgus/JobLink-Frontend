import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { JobCard, JobSummary, SavedJob } from '../../core/interfaces/job';
import { ToastService } from '../../core/services/toast.service';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-job-card',
    standalone: true,
    imports: [CommonModule, ButtonModule, ConfirmPopupModule],
    templateUrl: './job-card.component.html',
    styleUrl: './job-card.component.scss'
})
export class JobCardComponent {
    constructor(
        private _toastService: ToastService,
        private confirmationService: ConfirmationService
    ) { }

    @Input({ required: true }) job!: JobCard;
    @Input({ required: true }) _isSaved!: boolean;

    @Output() applyClicked = new EventEmitter<JobCard>();

    onApply(): void {
        if (this.job.isApplied) {
            return;
        }
        this.applyClicked.emit(this.job);
    }

    @Output() saveToggled = new EventEmitter<JobCard>();

    onBookmarkClick(event: Event): void {
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
                    this.saveToggled.emit(this.job);
                    this._isSaved = false;
                },
            });
        } else {
            this.saveToggled.emit(this.job);
            this._isSaved = true;
        }
    }
}
