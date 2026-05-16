import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Job } from '../../core/abstractions/job';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { JobActionsService } from '../../core/services/job-actions.service';

@Component({
    selector: 'app-job-card',
    standalone: true,
    imports: [CommonModule, ButtonModule, ConfirmPopupModule, RouterLink],
    templateUrl: './job-card.component.html',
    styleUrl: './job-card.component.scss'
})
export class JobCardComponent {
    private _jobActionsService: JobActionsService = inject(JobActionsService);
    private confirmationService: ConfirmationService = inject(ConfirmationService);

    @Input({ required: true }) job!: Job;

    // navigate to job page instead
    // onApply(): void {
    //     this._jobActionsService.apply(this.job).subscribe();
    // }

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
                    this._jobActionsService.unsave(this.job).subscribe();
                },
            });
        } else {
            this._jobActionsService.save(this.job).subscribe();
        }
    }
}
