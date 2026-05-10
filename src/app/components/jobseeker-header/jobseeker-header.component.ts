import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-jobseeker-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        FormsModule,
        InputTextModule,
        MenuModule
    ],
    templateUrl: './jobseeker-header.component.html',
    styleUrl: './jobseeker-header.component.scss'
})
export class JobseekerHeaderComponent {
    private router = inject(Router);
    private authService = inject(AuthService);

    searchQuery = '';

    navLinks = [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Explore', route: '/explore' },
        { label: 'My Applications', route: '/applications' },
        { label: 'Saved Jobs', route: '/saved-jobs' },
    ];

    items: MenuItem[] = [
        { label: 'Yousef Mohamed', routerLink: '/profile' },
        { separator: true },
        { label: 'Profile', icon: 'pi pi-user', routerLink: '/profile' },
        { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
        { separator: true },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
    ];

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/auth/welcome']);
            }
        });
    }

    onNotifications(): void {

    }
}
