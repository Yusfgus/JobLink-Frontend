import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-jobseeker-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        FormsModule,
        InputTextModule,
    ],
    templateUrl: './jobseeker-header.component.html',
    styleUrl: './jobseeker-header.component.scss'
})
export class JobseekerHeaderComponent {
    private router = inject(Router);

    searchQuery = '';

    profileMenuOpen = signal(false);

    navLinks = [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Explore', route: '/explore' },
        { label: 'My Applications', route: '/applications' },
        { label: 'Saved Jobs', route: '/saved-jobs' },
    ];

    constructor(private elRef: ElementRef) { }

    /** Close dropdown when clicking outside the component */
    @HostListener('document:click', ['$event.target'])
    onDocumentClick(target: EventTarget | null): void {
        const clickedElement = target as Node;
        if (clickedElement && !this.elRef.nativeElement.contains(clickedElement)) {
            this.profileMenuOpen.set(false);
        }
    }

    toggleProfileMenu(): void {
        this.profileMenuOpen.update(v => !v);
    }

    onNotifications(): void {
        console.log('Notifications clicked');
    }

    onEditProfile(): void {
        this.profileMenuOpen.set(false);
        console.log('Edit Profile');
    }

    onSettings(): void {
        this.profileMenuOpen.set(false);
        console.log('Settings');
    }

    onLogout(): void {
        this.profileMenuOpen.set(false);
        console.log('Logout');
        inject(AuthService).logout().subscribe(() => {
            this.router.navigate(['/auth/welcome']);
        });
    }
}
