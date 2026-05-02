import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { Job, Skill } from '../../core/abstractions/job';
import { JobActionsService } from '../../core/services/job-actions.service';

@Component({
    selector: 'app-job-details',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TagModule,
        DividerModule,
        CardModule,
        TooltipModule
    ],
    templateUrl: './job-details.component.html',
    styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent {
    private _jobActionsService: JobActionsService = inject(JobActionsService);
    @Input({ required: true }) job!: Job;

    get salaryRange(): string {
        const { minSalary, maxSalary } = this.job;
        if (minSalary == null && maxSalary == null) return 'Not specified';
        if (minSalary != null && maxSalary != null)
            return `$${(minSalary / 1000).toFixed(0)}k – $${(maxSalary / 1000).toFixed(0)}k`;
        if (minSalary != null) return `From $${(minSalary / 1000).toFixed(0)}k`;
        return `Up to $${(maxSalary! / 1000).toFixed(0)}k`;
    }

    get statusSeverity(): 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'contrast' {
        switch (this.job.status?.toLowerCase()) {
            case 'active': return 'success';
            case 'closed': return 'danger';
            case 'paused': return 'warning';
            default: return 'info';
        }
    }

    get location(): string {
        const parts = [this.job.area, this.job.city, this.job.country].filter(Boolean);
        return parts.join(', ');
    }

    get requiredSkills(): Skill[] {
        return this.job.skills.filter(s => s.isRequired);
    }

    get optionalSkills(): Skill[] {
        return this.job.skills.filter(s => !s.isRequired);
    }

    onApply(): void {
        this._jobActionsService.apply(this.job);
    }

    onBookmarkClick(): void {
        if (this.job.isSaved) {
            this._jobActionsService.unsave(this.job);
        }
        else {
            this._jobActionsService.save(this.job)
        }
    }
}
