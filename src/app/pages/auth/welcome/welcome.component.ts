import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
    constructor(private router: Router) { }

    onGetStarted(): void {
        this.router.navigate(['/auth/register/jobseeker']);
    }

    onBuildTeam(): void {
        this.router.navigate(['/auth/register/employer']);
    }
}
