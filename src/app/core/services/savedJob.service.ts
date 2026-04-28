import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SavedJob } from '../interfaces/job';
import { PagedResponse } from '../interfaces/pagedResponse';
import { AuthService } from './auth.service';
import { ApplicationsService } from './applications.service';

@Injectable({
    providedIn: 'root'
})
export class SavedJobService {

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _applicationsService: ApplicationsService
    ) { }

    visibleJobsLimit = 5;

    private _savedJobsSubject: BehaviorSubject<SavedJob[]> = new BehaviorSubject<SavedJob[]>([]);
    savedJobs: Observable<SavedJob[]> = this._savedJobsSubject.asObservable();
    private _currentPage: number = 1;
    private _pageSize: number = 10;
    private _totalPages: number = 0;
    protected _totalCount: number = 0;
    private _hasNext: boolean = true;
    private _hasPrevious: boolean = false;

    load_saved_jobs(page: number = 1, page_size: number = 10): void {
        const startIndex = (page - 1) * page_size, endIndex = page * page_size - 1;
        if ((startIndex < this._savedJobsSubject.value.length && endIndex < this._savedJobsSubject.value.length)
            || !this._hasNext) {
            return;
        }

        this._httpClient.get<PagedResponse<SavedJob>>(`${environment.apiRootUrl}/job-seekers/me/jobs/saved?page=${page}&pageSize=${page_size}`, {
            headers: {
                Authorization: `Bearer ${this._authService.getAccessToken()}`
            }
        })
            .subscribe({
                next: (response: PagedResponse<SavedJob>) => {
                    this._savedJobsSubject.next([...this._savedJobsSubject.value, ...response.items]);
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
                    const jobIndex = this._savedJobsSubject.value.findIndex((job: SavedJob) => job.id === job_id);
                    if (jobIndex !== -1) {
                        this._savedJobsSubject.value[jobIndex].isApplied = true;
                    }
                })
            );
    }

    save_job(job: SavedJob): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiRootUrl}/jobs/${job.id}/save`, null, { headers: { Authorization: `Bearer ${this._authService.getAccessToken()}` } })
            .pipe(
                tap(() => {
                    job.savedAtUtc = new Date(Date.now());
                    this._savedJobsSubject.next([...this._savedJobsSubject.value, job]);
                    this._totalCount++;
                })
            );
    }

    unsave_job(job_id: string): Observable<any> {
        return this._httpClient.delete<any>(`${environment.apiRootUrl}/jobs/${job_id}/unsave`, { headers: { Authorization: `Bearer ${this._authService.getAccessToken()}` } })
            .pipe(
                tap(() => {
                    this._savedJobsSubject.next(this._savedJobsSubject.value.filter(j => j.id !== job_id));
                    this._totalCount--;
                })
            );
    }
}