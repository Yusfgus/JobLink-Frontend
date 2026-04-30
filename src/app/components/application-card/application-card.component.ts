import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Application } from '../../core/abstractions/job';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { EventEmitter } from '@angular/core';

@Component({
	selector: 'app-application-card',
	standalone: true,
	imports: [CommonModule, ButtonModule, ConfirmPopupModule],
	templateUrl: './application-card.component.html',
	styleUrl: './application-card.component.scss'
})
export class ApplicationCardComponent {
	constructor(
		private confirmationService: ConfirmationService
	) { }

	@Input({ required: true }) application!: Application;

	@Output() withdrawClicked = new EventEmitter<Application>();

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
				this.withdrawClicked.emit(this.application);
			},
		});
	}
}
