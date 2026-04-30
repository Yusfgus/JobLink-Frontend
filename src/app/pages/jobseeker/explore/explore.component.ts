import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { Job } from '../../../core/abstractions/job';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { JobCardComponent } from '../../../components/job-card/job-card.component';
import { ToastService } from '../../../core/services/toast.service';
import { JobService } from '../../../core/services/job.service';
import { SavedJobService } from '../../../core/services/savedJob.service';
import { ApplicationsService } from '../../../core/services/applications.service';

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

    protected _jobService: JobService = inject(JobService);
    private _savedJobService: SavedJobService = inject(SavedJobService);
    private _applicationService: ApplicationsService = inject(ApplicationsService);
    private _spinner: NgxSpinnerService = inject(NgxSpinnerService);
    private _toastService: ToastService = inject(ToastService);

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

    pageSize = 10;

    jobs: Observable<Job[]> = this._jobService.jobs$;

    ngOnInit(): void {
        this.onLoadMore();
    }

    onLoadMore(): void {
        console.log('loading...')
        // if (this.jobs.length >= this.visibleJobsLimit) {
        this._spinner.show();
        this._jobService.loadJobs(this._jobService.CurrentPage + 1, this.pageSize);
        this._spinner.hide();
        // }
    }

    onApply(job: Job): void {
        this._spinner.show();
        this._applicationService.applyForJob(job).subscribe({
            next: () => {
                this._toastService.success('Success', 'Job applied successfully');
                this._savedJobService.updateAppliedStatus(job.id, true);
            },
            error: (error) => {
                this._toastService.error('Error', error.error.detail || 'Failed to apply for job');
            }
        }).add(() => {
            this._spinner.hide();
        });
    }

    onBookmarkClick(job: Job): void {
        if (job.isSaved) {
            this._savedJobService.unsave_job(job).subscribe({
                next: () => {
                    this._toastService.success('Success', 'Job unsaved successfully');
                },
                error: (error) => {
                    this._toastService.error('Error', error.error.detail || 'Failed to unsave job');
                }
            })
        }
        else {
            this._savedJobService.saveJob(job).subscribe({
                next: () => {
                    this._toastService.success('Success', 'Job saved successfully');
                },
                error: (error) => {
                    this._toastService.error('Error', error.error.detail || 'Failed to save job');
                }
            });
        }
    }
}
