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
export class JobService extends Paged {

    constructor(
        private _httpClient: HttpClient,
    ) { super(); }

    private _jobs = signal<Job[]>([]);
    jobs = this._jobs.asReadonly();

    loadJobs(page: number = 1, page_size: number = 10): Observable<PagedResponse<Job>> | void {
        const startIndex = (page - 1) * page_size, endIndex = page * page_size - 1;
        if ((startIndex < this._jobs().length && endIndex < this._jobs().length)
            || !this._hasNext) {
            return; // Can return of() if needed, but keeping original logic flow
        }
        return this._httpClient.get<PagedResponse<Job>>(`${environment.apiRootUrl}/jobs?page=${page}&pageSize=${page_size}`)
            .pipe(
                tap((response: PagedResponse<Job>) => {
                    this._jobs.update(jobs => [...jobs, ...response.items]);
                    this._currentPage = response.pageNumber;
                    this._totalPages = response.totalPages;
                    this._totalCount = response.totalCount;
                    this._hasNext = response.hasNextPage;
                    this._hasPrevious = response.hasPreviousPage;
                })
            );
    }

    getJobById(id: string): Observable<Job> {
        return this._httpClient.get<Job>(`${environment.apiRootUrl}/jobs/${id}`);
    }

    updateAppliedStatus(jobId: string, isApplied: boolean): void {
        this._jobs.update(jobs => 
            jobs.map(job =>
                job.id === jobId
                    ? { ...job, isApplied }
                    : job
            )
        );
    }

    updateSavedStatus(jobId: string, isSaved: boolean): void {
        this._jobs.update(jobs =>
            jobs.map(job =>
                job.id === jobId
                    ? { ...job, isSaved }
                    : job
            )
        );
    }

}