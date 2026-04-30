import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job } from '../abstractions/job';
import { PagedResponse } from '../abstractions/pagedResponse';
import { AuthService } from './auth.service';
import { Paged } from '../abstractions/paged';

@Injectable({
    providedIn: 'root'
})
export class JobService extends Paged {

    constructor(
        private _httpClient: HttpClient,
    ) { super(); }

    private _jobsSubject: BehaviorSubject<Job[]> = new BehaviorSubject<Job[]>([]);
    jobs$: Observable<Job[]> = this._jobsSubject.asObservable();

    private _jwtHeader: string = `Bearer ${inject(AuthService).getAccessToken()}`;

    loadJobs(page: number = 1, page_size: number = 10): void {
        const startIndex = (page - 1) * page_size, endIndex = page * page_size - 1;
        if ((startIndex < this._jobsSubject.value.length && endIndex < this._jobsSubject.value.length)
            || !this._hasNext) {
            return;
        }
        this._httpClient.get<PagedResponse<Job>>(`${environment.apiRootUrl}/jobs?page=${page}&pageSize=${page_size}`, { headers: { Authorization: this._jwtHeader } })
            .subscribe({
                next: (response: PagedResponse<Job>) => {
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

    getJobById(id: string): Observable<Job> {
        return this._httpClient.get<Job>(`${environment.apiRootUrl}/jobs/${id}`, { headers: { Authorization: this._jwtHeader } });
    }

    updateAppliedStatus(jobId: string, isApplied: boolean): void {
        this._jobsSubject.next(
            this._jobsSubject.value.map(job =>
                job.id === jobId
                    ? { ...job, isApplied }
                    : job
            )
        );
    }

    updateSavedStatus(jobId: string, isSaved: boolean): void {
        this._jobsSubject.next(
            this._jobsSubject.value.map(job =>
                job.id === jobId
                    ? { ...job, isSaved }
                    : job
            )
        );
    }

}