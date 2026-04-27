import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { JobSummary } from '../../../core/interfaces/job';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { PagedResponse } from '../../../core/interfaces/pagedResponse';
import { JobCardComponent } from '../../../components/job-card/job-card.component';

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

    private _jobService: JobService = inject(JobService);
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

    /* ── Job Data ─────────────────────────────────────── */
    visibleJobsLimit = 5;

    // jobs: Job[] = [
    //     {
    //         id: 1,
    //         title: 'Lead Product Designer',
    //         company: 'NexusFlow Systems',
    //         location: 'San Francisco, USA',
    //         postedAt: '2 days ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRkm7mpJSu3SimvwZyFpZDI1KglsVlLBwgRyxLtdfkBeh7XPkh7Vz2zkJpLJE8Hjwhd5_7bxy9dLq43t8YubYO3Fiwh0BgJA-DQvREU-tnmjmOe3LyMNUX6tvhF8zek0G-Y2vDtwyhoAmpIF3SYUWZqSVtuGAsX1EZlKlH1TNueGSNwptBGmjSGpJuRKoWvFPAg10NP2bclR86pohEBGNo2gLIHoAc9prQnfaWzU2AYjml_jdogMfA9b8QVnZ5UU3zXUio5cfN5a2P',
    //         tags: ['Remote', 'Full-time', 'Mid-Senior'],
    //         description: 'We are looking for a visionary Lead Product Designer to architect the future of decentralized collaboration tools.',
    //         skills: ['Figma', 'Systems Thinking', 'Prototyping', 'React'],
    //     },
    //     {
    //         id: 2,
    //         title: 'Senior Backend Engineer',
    //         company: 'Vertex Finance',
    //         location: 'London, UK',
    //         postedAt: '5 hours ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvXOLHBQvdtqzPsswIEUQ08ZFcBsKOO6t4Y-5SxzxEE7BdbfyD8phaLodYwuERadBXkzsBsedQxigkTnK_LOyP83yAc80hTKurIz_XMjuPayIJEiCPZ59g3O_u-9e0KV8retnbGwTyiIf7HGBmZjZVGN7TE2efSuZpepfkpbiW5agQrkzrFwZJSijdhw_yGTJ2N6HC_1Uv1a7wfNl_FaRACmPROt9QFsgjfHND5Z17u4E4pCTPcpz768OHj_mGb9Rl2rV5APC-ow6f',
    //         tags: ['Hybrid', 'Full-time', 'Senior'],
    //         description: 'Join our core infrastructure team to build high-frequency trading platforms.',
    //         skills: ['Go', 'Rust', 'Kubernetes', 'Redis'],
    //     },
    //     {
    //         id: 3,
    //         title: 'Growth Marketing Manager',
    //         company: 'Elevate Agency',
    //         location: 'Berlin, Germany',
    //         postedAt: '1 week ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLrk3pL41dXt9Xp-XW9tqZS1ME4jEIrw9XDVk-U5HAZnxw9x5_PYlL93ujGc5OyZhwHZRy3tRT1waKs4N-KD-edfzhowCQGW03VaKYuMxzNzaevq_I5pDESZthItxNOn5l_wkYtA_dLNt0A2u883Pzk5QGQWpaqKXWTAJeXqMifsuiNiCTNYq3LOhxYTYVimErvArE-MpZhbnLBRrdRuUMxEgaw62JfU5bA4lY-wmvThKBTFubgCQDopre4Igr5TRxg4HV2Xqq089E',
    //         tags: ['On-site', 'Contract', 'Director'],
    //         description: 'Strategize and execute data-driven campaigns to scale our user base across Europe.',
    //         skills: ['SEO/SEM', 'Analytics', 'Copywriting', 'Growth Loops'],
    //     },
    //     {
    //         id: 4,
    //         title: 'DevOps Architect',
    //         company: 'CloudScale',
    //         location: 'Austin, USA',
    //         postedAt: '3 days ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRkm7mpJSu3SimvwZyFpZDI1KglsVlLBwgRyxLtdfkBeh7XPkh7Vz2zkJpLJE8Hjwhd5_7bxy9dLq43t8YubYO3Fiwh0BgJA-DQvREU-tnmjmOe3LyMNUX6tvhF8zek0G-Y2vDtwyhoAmpIF3SYUWZqSVtuGAsX1EZlKlH1TNueGSNwptBGmjSGpJuRKoWvFPAg10NP2bclR86pohEBGNo2gLIHoAc9prQnfaWzU2AYjml_jdogMfA9b8QVnZ5UU3zXUio5cfN5a2P',
    //         tags: ['Remote', 'Full-time', 'Senior'],
    //         description: 'Design and implement scalable CI/CD pipelines for a global microservices architecture.',
    //         skills: ['Terraform', 'AWS', 'Docker', 'Jenkins'],
    //     },
    //     {
    //         id: 5,
    //         title: 'Full Stack Developer',
    //         company: 'Innovate Solutions',
    //         location: 'Toronto, Canada',
    //         postedAt: '1 day ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvXOLHBQvdtqzPsswIEUQ08ZFcBsKOO6t4Y-5SxzxEE7BdbfyD8phaLodYwuERadBXkzsBsedQxigkTnK_LOyP83yAc80hTKurIz_XMjuPayIJEiCPZ59g3O_u-9e0KV8retnbGwTyiIf7HGBmZjZVGN7TE2efSuZpepfkpbiW5agQrkzrFwZJSijdhw_yGTJ2N6HC_1Uv1a7wfNl_FaRACmPROt9QFsgjfHND5Z17u4E4pCTPcpz768OHj_mGb9Rl2rV5APC-ow6f',
    //         tags: ['Hybrid', 'Full-time', 'Mid-Level'],
    //         description: 'Build high-performance web applications using Angular and Node.js.',
    //         skills: ['Angular', 'Node.js', 'TypeScript', 'MongoDB'],
    //     },
    //     {
    //         id: 6,
    //         title: 'UX Researcher',
    //         company: 'DesignFirst',
    //         location: 'Seattle, USA',
    //         postedAt: '4 hours ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLrk3pL41dXt9Xp-XW9tqZS1ME4jEIrw9XDVk-U5HAZnxw9x5_PYlL93ujGc5OyZhwHZRy3tRT1waKs4N-KD-edfzhowCQGW03VaKYuMxzNzaevq_I5pDESZthItxNOn5l_wkYtA_dLNt0A2u883Pzk5QGQWpaqKXWTAJeXqMifsuiNiCTNYq3LOhxYTYVimErvArE-MpZhbnLBRrdRuUMxEgaw62JfU5bA4lY-wmvThKBTFubgCQDopre4Igr5TRxg4HV2Xqq089E',
    //         tags: ['On-site', 'Full-time', 'Senior'],
    //         description: 'Conduct user research and usability testing to inform product strategy.',
    //         skills: ['User Interviews', 'Data Analysis', 'Persona Creation', 'A/B Testing'],
    //     },
    //     {
    //         id: 7,
    //         title: 'Mobile App Developer',
    //         company: 'AppVenture',
    //         location: 'Remote',
    //         postedAt: '6 hours ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRkm7mpJSu3SimvwZyFpZDI1KglsVlLBwgRyxLtdfkBeh7XPkh7Vz2zkJpLJE8Hjwhd5_7bxy9dLq43t8YubYO3Fiwh0BgJA-DQvREU-tnmjmOe3LyMNUX6tvhF8zek0G-Y2vDtwyhoAmpIF3SYUWZqSVtuGAsX1EZlKlH1TNueGSNwptBGmjSGpJuRKoWvFPAg10NP2bclR86pohEBGNo2gLIHoAc9prQnfaWzU2AYjml_jdogMfA9b8QVnZ5UU3zXUio5cfN5a2P',
    //         tags: ['Remote', 'Contract', 'Mid-Level'],
    //         description: 'Develop high-quality mobile applications for iOS and Android platforms.',
    //         skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
    //     },
    //     {
    //         id: 8,
    //         title: 'Security Engineer',
    //         company: 'SafeGuard Tech',
    //         location: 'Chicago, USA',
    //         postedAt: '12 hours ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvXOLHBQvdtqzPsswIEUQ08ZFcBsKOO6t4Y-5SxzxEE7BdbfyD8phaLodYwuERadBXkzsBsedQxigkTnK_LOyP83yAc80hTKurIz_XMjuPayIJEiCPZ59g3O_u-9e0KV8retnbGwTyiIf7HGBmZjZVGN7TE2efSuZpepfkpbiW5agQrkzrFwZJSijdhw_yGTJ2N6HC_1Uv1a7wfNl_FaRACmPROt9QFsgjfHND5Z17u4E4pCTPcpz768OHj_mGb9Rl2rV5APC-ow6f',
    //         tags: ['Hybrid', 'Full-time', 'Senior'],
    //         description: 'Implement and monitor security measures to protect organization networks and data.',
    //         skills: ['Cybersecurity', 'Network Security', 'Penetration Testing', 'Python'],
    //     },
    //     {
    //         id: 9,
    //         title: 'Product Manager',
    //         company: 'Visionary Lab',
    //         location: 'San Francisco, USA',
    //         postedAt: '2 days ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLrk3pL41dXt9Xp-XW9tqZS1ME4jEIrw9XDVk-U5HAZnxw9x5_PYlL93ujGc5OyZhwHZRy3tRT1waKs4N-KD-edfzhowCQGW03VaKYuMxzNzaevq_I5pDESZthItxNOn5l_wkYtA_dLNt0A2u883Pzk5QGQWpaqKXWTAJeXqMifsuiNiCTNYq3LOhxYTYVimErvArE-MpZhbnLBRrdRuUMxEgaw62JfU5bA4lY-wmvThKBTFubgCQDopre4Igr5TRxg4HV2Xqq089E',
    //         tags: ['On-site', 'Full-time', 'Lead'],
    //         description: 'Define product vision and roadmap while collaborating with engineering and design teams.',
    //         skills: ['Product Strategy', 'Market Research', 'Agile', 'Jira'],
    //     },
    //     {
    //         id: 10,
    //         title: 'Data Scientist',
    //         company: 'InsightAnalytics',
    //         location: 'New York, USA',
    //         postedAt: '1 week ago',
    //         logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRkm7mpJSu3SimvwZyFpZDI1KglsVlLBwgRyxLtdfkBeh7XPkh7Vz2zkJpLJE8Hjwhd5_7bxy9dLq43t8YubYO3Fiwh0BgJA-DQvREU-tnmjmOe3LyMNUX6tvhF8zek0G-Y2vDtwyhoAmpIF3SYUWZqSVtuGAsX1EZlKlH1TNueGSNwptBGmjSGpJuRKoWvFPAg10NP2bclR86pohEBGNo2gLIHoAc9prQnfaWzU2AYjml_jdogMfA9b8QVnZ5UU3zXUio5cfN5a2P',
    //         tags: ['Remote', 'Full-time', 'Senior'],
    //         description: 'Apply advanced statistical and machine learning techniques to solve complex business problems.',
    //         skills: ['Machine Learning', 'Python', 'SQL', 'R'],
    //     }
    // ];

    onLoadMore(): void {
        this.visibleJobsLimit += 5;
        if (this.visibleJobsLimit > this._jobs.value.length) {
            this.load_all_jobs();
        }
    }

    private _jobs: BehaviorSubject<JobSummary[]> = new BehaviorSubject<JobSummary[]>([]);
    jobs: Observable<JobSummary[]> = this._jobs.asObservable();
    private _currentPage: number = 1;
    private _pageSize: number = 10;
    private _totalPages: number = 0;
    protected _totalCount: number = 0;
    private _hasNext: boolean = true;
    private _hasPrevious: boolean = false;

    load_all_jobs(): void {
        if (!this._hasNext) {
            return;
        }
        this._spinner.show();
        this._jobService.get_all_jobs(this._currentPage, this._pageSize).subscribe({
            next: (response: PagedResponse<JobSummary>) => {
                this._jobs.next([...this._jobs.value, ...response.items]);
                this._spinner.hide();
                this._currentPage = response.pageNumber;
                this._totalPages = response.totalPages;
                this._totalCount = response.totalCount;
                this._hasNext = response.hasNextPage;
                this._hasPrevious = response.hasPreviousPage;
            },
            error: () => {
                this._hasNext = false;
                this._spinner.hide();
            }
        });
    }

    ngOnInit(): void {
        this.load_all_jobs();
    }
}
