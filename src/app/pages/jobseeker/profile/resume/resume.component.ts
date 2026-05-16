import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ResumeService } from '../../../../core/services/jobseeker/resume.service';
import { ToastService } from '../../../../core/services/ui/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiErrorResponse } from '../../../../core/abstractions/response';

@Component({
    selector: 'app-resume',
    standalone: true,
    imports: [CommonModule, ButtonModule, DividerModule],
    templateUrl: './resume.component.html',
    styleUrl: './resume.component.scss'
})
export class ResumeComponent implements OnInit {
    protected readonly resumeService = inject(ResumeService);
    private readonly toastService = inject(ToastService);
    private readonly spinner = inject(NgxSpinnerService);

    isDragging = false;

    ngOnInit(): void {
        this.spinner.show();
        this.resumeService.loadResume().subscribe({
            error: (err: ApiErrorResponse) => {
                this.toastService.error(err.title || 'Error', err.detail || 'Failed to load resume');
            }
        }).add(() => this.spinner.hide());
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.uploadFile(file);
        }
    }

    onFileDropped(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;

        const file = event.dataTransfer?.files[0];
        if (file) {
            this.uploadFile(file);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;
    }

    private uploadFile(file: File): void {
        // Validation
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            this.toastService.error('Invalid File Type', 'Only PDF, DOC, and DOCX files are allowed');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.toastService.error('File Too Large', 'Maximum file size is 5MB');
            return;
        }

        this.spinner.show();
        this.resumeService.uploadResume(file).subscribe({
            next: () => {
                this.toastService.success('Success', 'Resume uploaded successfully');
            },
            error: (err: ApiErrorResponse) => {
                this.toastService.error(err.title || 'Error', err.detail || 'Failed to upload resume');
            }
        }).add(() => this.spinner.hide());
    }

    onPreview(): void {
        const resume = this.resumeService.resume();
        if (resume?.resumeUrl) {
            window.open(resume.resumeUrl, '_blank');
        }
    }

    onDelete(): void {
        this.spinner.show();
        this.resumeService.deleteResume().subscribe({
            next: () => {
                this.toastService.success('Success', 'Resume removed successfully');
            },
            error: (err: ApiErrorResponse) => {
                this.toastService.error(err.title || 'Error', err.detail || 'Failed to delete resume');
            }
        }).add(() => this.spinner.hide());
    }
}
