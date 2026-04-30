import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Job } from '../../core/abstractions/job';

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
        private confirmationService: ConfirmationService
    ) { }

    @Input({ required: true }) job!: Job;

    @Output() applyClicked = new EventEmitter<Job>();

    onApply(): void {
        if (this.job.isApplied) {
            console.log("Job is already applied")
            return;
        }
        this.applyClicked.emit(this.job);
    }

    @Output() saveToggled = new EventEmitter<Job>();

    onBookmarkClick(event: Event): void {
        if (this.job.isSaved) {
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
                },
            });
        } else {
            this.saveToggled.emit(this.job);
        }
    }
}
