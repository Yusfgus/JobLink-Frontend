import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-not-found',
	standalone: true,
	imports: [ButtonModule],
	templateUrl: './not-found.component.html',
	styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
	private router = inject(Router);

	@Input() showHomeButton: boolean = true;
	@Input() showContactButton: boolean = true;

	goToHome() {
		this.router.navigate(['/']);
	}
	goToContact() {
		this.router.navigate(['/contact']);
	}
}
