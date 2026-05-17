import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Job } from '../../abstractions/job';
import { PagedResponse } from '../../abstractions/pagedResponse';
import { Paged } from '../../abstractions/paged';

@Injectable({
    providedIn: 'root'
})
export class SavedJobService extends Paged {

    constructor(
        private _httpClient: HttpClient
    ) { super(); }

    visibleJobsLimit = 5;

    private _savedJobs = signal<Job[]>([]);
    savedJobs = this._savedJobs.asReadonly();

    loadSavedJob(page: number = 1, page_size: number = 10): Observable<PagedResponse<Job>> | void {
        const startIndex = (page - 1) * page_size, endIndex = page * page_size - 1;
        if ((startIndex < this._savedJobs().length && endIndex < this._savedJobs().length)
            || !this._hasNext) {
            return;
        }
        return this._httpClient.get<PagedResponse<Job>>(`${environment.apiRootUrl}/job-seekers/me/jobs/saved?page=${page}&pageSize=${page_size}`)
            .pipe(
                tap((response: PagedResponse<Job>) => {
                    response.items.forEach(j => j.isSaved = true);
                    this._savedJobs.update(jobs => [...jobs, ...response.items]);
                    this._currentPage = response.pageNumber;
                    this._totalPages = response.totalPages;
                    this._totalCount = response.totalCount;
                    this._hasNext = response.hasNextPage;
                    this._hasPrevious = response.hasPreviousPage;
                })
            );
    }

    saveJob(job: Job): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiRootUrl}/jobs/${job.id}/save`, null)
            .pipe(
                tap(() => {
                    job.savedAtUtc = new Date(Date.now());
                    job.isSaved = true;
                    this._savedJobs.update(jobs => [job, ...jobs]);
                    this._totalCount++;
                })
            );
    }

    unsave_job(job: Job): Observable<any> {
        return this._httpClient.delete<any>(`${environment.apiRootUrl}/jobs/${job.id}/unsave`)
            .pipe(
                tap(() => {
                    job.isSaved = false;
                    this._savedJobs.update(jobs => jobs.filter(j => j.id !== job.id));
                    this._totalCount--;
                })
            );
    }

    updateAppliedStatus(jobId: string, isApplied: boolean): void {
        this._savedJobs.update(jobs =>
            jobs.map(job =>
                job.id === jobId
                    ? { ...job, isApplied }
                    : job
            )
        );
    }
}