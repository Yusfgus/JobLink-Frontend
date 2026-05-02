import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { Job } from '../../../core/abstractions/job';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { JobCardComponent } from '../../../components/job-card/job-card.component';
import { JobService } from '../../../core/services/job.service';

interface Filter {
    name: string;
    options: { label: string; value: string; checked: boolean }[];
}

@Component({
    selector: 'app-explore',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        JobCardComponent,
    ],
    templateUrl: './explore.component.html',
    styleUrl: './explore.component.scss'
})
export class ExploreComponent {

    protected jobService: JobService = inject(JobService);
    protected jobs$: Observable<Job[]> = this.jobService.jobs$;
    private _spinner: NgxSpinnerService = inject(NgxSpinnerService);

    /* ── Filter State ─────────────────────────────────── */
    filters: Filter[] = [
        {
            name: 'Experience Level',
            options: [
                { label: 'Entry Level', value: 'entryLevel', checked: false },
                { label: 'Mid-Senior', value: 'midSenior', checked: true },
                { label: 'Director', value: 'director', checked: false },
            ],
        },
        {
            name: 'Location Type',
            options: [
                { label: 'Remote', value: 'remote', checked: false },
                { label: 'On-site', value: 'onSite', checked: true },
                { label: 'Hybrid', value: 'hybrid', checked: false },
            ],
        },
        {
            name: 'Job Type',
            options: [
                { label: 'Full-time', value: 'fullTime', checked: false },
                { label: 'Contract', value: 'contract', checked: true },
                { label: 'Freelance', value: 'freelance', checked: false },
            ],
        },
        {
            name: 'Industry',
            options: [
                { label: 'Technology', value: 'technology', checked: false },
                { label: 'Finance', value: 'finance', checked: false },
                { label: 'Healthcare', value: 'healthcare', checked: false },
                { label: 'Education', value: 'education', checked: false },
                { label: 'Retail', value: 'retail', checked: false },
                { label: 'Other', value: 'other', checked: false },
            ],
        },
    ]

    onClearFilters(): void {
        this.filters.forEach(filter => {
            filter.options.forEach(option => {
                option.checked = false;
            });
        });
    }

    pageSize = 10;

    ngOnInit(): void {
        this.onLoadMore();
    }

    onLoadMore(): void {
        this._spinner.show();
        this.jobService.loadJobs(this.jobService.CurrentPage + 1, this.pageSize);
        this._spinner.hide();
    }
}
