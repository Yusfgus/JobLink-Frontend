import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Application } from '../../core/abstractions/job';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { JobActionsService } from '../../core/services/job-actions.service';

@Component({
	selector: 'app-application-card',
	standalone: true,
	imports: [CommonModule, ButtonModule, ConfirmPopupModule, RouterLink],
	templateUrl: './application-card.component.html',
	styleUrl: './application-card.component.scss'
})
export class ApplicationCardComponent {
	private _jobActionsService: JobActionsService = inject(JobActionsService);
	private confirmationService: ConfirmationService = inject(ConfirmationService);

	@Input({ required: true }) application!: Application;

	onWithdrawClick(event: Event): void {
		this.confirmationService.confirm({
			target: event.target as EventTarget,
			message: 'Are you sure you want to withdraw this application?',
			header: 'Confirm',
			acceptLabel: 'Withdraw',
			rejectLabel: 'Cancel',
			blockScroll: true,
			acceptButtonStyleClass: 'p-button-danger',
			accept: () => {
				this._jobActionsService.withdrawApplication(this.application.jobId).subscribe();
			},
		});
	}
}
