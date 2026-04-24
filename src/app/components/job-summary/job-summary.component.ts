import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Job } from '../../core/interfaces/job';

@Component({
    selector: 'app-job-summary',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './job-summary.component.html',
    styleUrl: './job-summary.component.scss'
})
export class JobSummaryComponent {
    @Input({ required: true }) job!: Job;

    @Output() apply = new EventEmitter<Job>();
    @Output() bookmark = new EventEmitter<Job>();

    onApply(): void {
        this.apply.emit(this.job);
    }

    onBookmark(): void {
        this.bookmark.emit(this.job);
    }
}
