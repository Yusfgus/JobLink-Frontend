import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { JobSeekerService } from '../../../../core/services/jobseeker/jobseeker.service';
import { ToastService } from '../../../../core/services/ui/toast.service';
import { ApiErrorResponse } from '../../../../core/abstractions/response';

interface NavItem {
    label: string;
    route: string;
    icon: string;
    exact?: boolean;
}

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        AvatarModule,
        DividerModule,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})
export class LayoutComponent {

    private readonly jobSeekerService = inject(JobSeekerService);
    private readonly toastService = inject(ToastService);

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

    onUploadClick(fileInput: HTMLInputElement): void {
        fileInput.click();
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.jobSeekerService.uploadProfilePicture(file).subscribe({
                next: () => {
                    this.toastService.success('Success', 'Profile picture updated');
                },
                error: (error: ApiErrorResponse) => {
                    this.toastService.error(error.title, error.detail);
                }
            });
        }
    }

    onDeletePicture(): void {
        this.jobSeekerService.deleteProfilePicture().subscribe({
            next: () => {
                this.toastService.success('Success', 'Profile picture removed');
            },
            error: (error: ApiErrorResponse) => {
                this.toastService.error(error.title, error.detail);
            }
        });
    }

    navItems: NavItem[] = [
        { label: 'General Info', route: 'general-info', icon: 'person', exact: true },
        { label: 'Resume', route: 'resume', icon: 'description' },
        { label: 'Education', route: 'education', icon: 'school' },
        { label: 'Experience', route: 'experience', icon: 'work' },
        { label: 'Skills', route: 'skills', icon: 'psychology' },
    ];
}
