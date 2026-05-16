import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job } from '../abstractions/job';
import { PagedResponse } from '../abstractions/pagedResponse';
import { Paged } from '../abstractions/paged';

@Injectable({
    providedIn: 'root'
})
export class SavedJobService extends Paged {

    constructor(
        private _httpClient: HttpClient
    ) { super(); }

    visibleJobsLimit = 5;

    private _savedJobsSubject: BehaviorSubject<Job[]> = new BehaviorSubject<Job[]>([]);
    savedJobs$: Observable<Job[]> = this._savedJobsSubject.asObservable();

    loadSavedJob(page: number = 1, page_size: number = 10): void {
        const startIndex = (page - 1) * page_size, endIndex = page * page_size - 1;
        if ((startIndex < this._savedJobsSubject.value.length && endIndex < this._savedJobsSubject.value.length)
            || !this._hasNext) {
            return;
        }
        this._httpClient.get<PagedResponse<Job>>(`${environment.apiRootUrl}/job-seekers/me/jobs/saved?page=${page}&pageSize=${page_size}`)
            .subscribe({
                next: (response: PagedResponse<Job>) => {
                    response.items.forEach(j => j.isSaved = true);
                    this._savedJobsSubject.next([...this._savedJobsSubject.value, ...response.items]);
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

    saveJob(job: Job): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiRootUrl}/jobs/${job.id}/save`, null)
            .pipe(
                tap(() => {
                    job.savedAtUtc = new Date(Date.now());
                    job.isSaved = true;
                    this._savedJobsSubject.next([job, ...this._savedJobsSubject.value]);
                    this._totalCount++;
                })
            );
    }

    unsave_job(job: Job): Observable<any> {
        return this._httpClient.delete<any>(`${environment.apiRootUrl}/jobs/${job.id}/unsave`)
            .pipe(
                tap(() => {
                    job.isSaved = false;
                    this._savedJobsSubject.next(this._savedJobsSubject.value.filter(j => j.id !== job.id));
                    this._totalCount--;
                })
            );
    }

    updateAppliedStatus(jobId: string, isApplied: boolean): void {
        this._savedJobsSubject.next(
            this._savedJobsSubject.value.map(job =>
                job.id === jobId
                    ? { ...job, isApplied }
                    : job
            )
        );
    }
}