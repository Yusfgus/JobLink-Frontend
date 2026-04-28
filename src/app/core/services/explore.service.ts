import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobCard, JobSummary, SavedJob } from '../interfaces/job';
import { PagedResponse } from '../interfaces/pagedResponse';
import { AuthService } from './auth.service';
import { SavedJobService } from './savedJob.service';
import { ApplicationsService } from './applications.service';

@Injectable({
    providedIn: 'root'
})
export class ExploreService {

    constructor(
        private _httpClient: HttpClient,
        private _savedJobsService: SavedJobService,
        private _applicationsService: ApplicationsService
    ) { }

    jwtHeader: string = `Bearer ${inject(AuthService).getAccessToken()}`;

    visibleJobsLimit = 5;

    private _jobsSubject: BehaviorSubject<JobSummary[]> = new BehaviorSubject<JobSummary[]>([]);
    jobs: Observable<JobSummary[]> = this._jobsSubject.asObservable();
    _currentPage: number = 1;
    _pageSize: number = 10;
    _totalPages: number = 0;
    _totalCount: number = 0;
    _hasNext: boolean = true;
    _hasPrevious: boolean = false;

    load_jobs(page: number = 1, page_size: number = 10): void {
        const startIndex = (page - 1) * page_size, endIndex = page * page_size - 1;
        if ((startIndex < this._jobsSubject.value.length && endIndex < this._jobsSubject.value.length)
            || !this._hasNext) {
            return;
        }
        this._httpClient.get<PagedResponse<JobSummary>>(`${environment.apiRootUrl}/jobs?page=${page}&pageSize=${page_size}`, { headers: { Authorization: this.jwtHeader } })
            .subscribe({
                next: (response: PagedResponse<JobSummary>) => {
                    this._jobsSubject.next([...this._jobsSubject.value, ...response.items]);
                    console.log(response);
                    this._currentPage = response.pageNumber;
                    this._totalPages = response.totalPages;
                    this._totalCount = response.totalCount;
                    this._hasNext = response.hasNextPage;
                    this._hasPrevious = response.hasPreviousPage;
                },
                error: () => {
                    this._hasNext = false;
                }
            });
    }

    apply_for_job(job_id: string): Observable<any> {
        return this._applicationsService.apply_for_job(job_id)
            .pipe(
                tap(() => {
                    const jobIndex = this._jobsSubject.value.findIndex((job: JobSummary) => job.id === job_id);
                    if (jobIndex !== -1) {
                        this._jobsSubject.value[jobIndex].isApplied = true;
                    }
                })
            );
    }

    save_job(job: JobCard): Observable<any> {
        return this._savedJobsService.save_job(job as SavedJob)
            .pipe(
                tap(() => {
                    const jobIndex = this._jobsSubject.value.findIndex((j: JobSummary) => j.id === job.id);
                    if (jobIndex !== -1) {
                        this._jobsSubject.value[jobIndex].isSaved = true;
                    }
                })
            );
    }

    unsave_job(job_id: string): Observable<any> {
        return this._savedJobsService.unsave_job(job_id)
            .pipe(
                tap(() => {
                    const jobIndex = this._jobsSubject.value.findIndex((job: JobSummary) => job.id === job_id);
                    if (jobIndex !== -1) {
                        this._jobsSubject.value[jobIndex].isSaved = false;
                    }
                })
            );
    }
}