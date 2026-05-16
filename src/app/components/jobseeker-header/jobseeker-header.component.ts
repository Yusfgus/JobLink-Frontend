import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth/auth.service';
import { JobSeekerService } from '../../core/services/jobseeker/jobseeker.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-jobseeker-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        FormsModule,
        InputTextModule,
        MenuModule,
        AvatarModule
    ],
    templateUrl: './jobseeker-header.component.html',
    styleUrl: './jobseeker-header.component.scss'
})
export class JobseekerHeaderComponent {
    private router = inject(Router);
    private authService = inject(AuthService);
    private jobSeekerService = inject(JobSeekerService);

    searchQuery = '';

    navLinks = [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Explore', route: '/explore' },
        { label: 'My Applications', route: '/applications' },
        { label: 'Saved Jobs', route: '/saved-jobs' },
    ];

    items = computed<MenuItem[]>(() => [
        { label: this.fullName(), routerLink: '/profile' },
        { separator: true },
        { label: 'Profile', icon: 'pi pi-user', routerLink: '/profile' },
        { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
        { separator: true },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
    ]);

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/auth/welcome']);
            }
        });
    }

    onNotifications(): void {

    }

    profile = this.jobSeekerService.profile;
    profilePictureUrl = this.jobSeekerService.pictureUrl;

    fullName = computed(() => {
        const p = this.profile();
        if (!p) return '';
        return `${p.firstName} ${p.middleName ? p.middleName : p.lastName}`;
    });

    avatarLabel = computed(() => {
        const p = this.profile();
        if (!p) return 'XX';
        return `${p.firstName.charAt(0)}${p.middleName ? p.middleName.charAt(0) : p.lastName.charAt(0)}`.toUpperCase();
    });

    ngOnInit(): void {
    }
}
