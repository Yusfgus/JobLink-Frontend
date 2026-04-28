import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job } from '../interfaces/job';
import { PagedResponse } from '../interfaces/pagedResponse';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService {

    constructor(
        private _httpClient: HttpClient,
    ) { }

    jwtHeader: string = `Bearer ${inject(AuthService).getAccessToken()}`;

    visibleJobsLimit = 5;

    private _applicationsSubject: BehaviorSubject<Job[]> = new BehaviorSubject<Job[]>([]);
    applications$: Observable<Job[]> = this._applicationsSubject.asObservable();

    _currentPage: number = 1;
    _pageSize: number = 10;
    _totalPages: number = 0;
    _totalCount: number = 0;
    _hasNext: boolean = true;
    _hasPrevious: boolean = false;

    loadApplications(page: number = 1, page_size: number = 10): void {
        const startIndex = (page - 1) * page_size, endIndex = page * page_size - 1;
        if ((startIndex < this._applicationsSubject.value.length && endIndex < this._applicationsSubject.value.length)
            || !this._hasNext) {
            return;
        }
        this._httpClient.get<PagedResponse<Job>>(`${environment.apiRootUrl}/job-seekers/me/jobs/applied?page=${page}&pageSize=${page_size}`, { headers: { Authorization: this.jwtHeader } })
            .subscribe({
                next: (response: PagedResponse<Job>) => {
                    this._applicationsSubject.next([...this._applicationsSubject.value, ...response.items]);
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

    applyForJob(job: Job): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiRootUrl}/jobs/${job.id}/apply`, null, { headers: { Authorization: this.jwtHeader } })
            .pipe(
                tap(() => {
                    job.isApplied = true;
                    this._applicationsSubject.next([job, ...this._applicationsSubject.value]);
                    this._totalCount++;
                })
            );
    }

    withdrawApplication(job: Job): Observable<any> {
        return this._httpClient.delete<any>(`${environment.apiRootUrl}/jobs/${job.id}/withdraw`, { headers: { Authorization: this.jwtHeader } })
            .pipe(
                tap(() => {
                    job.isApplied = false;
                    this._applicationsSubject.next(this._applicationsSubject.value.filter(j => j.id !== job.id));
                    this._totalCount--;
                })
            );
    }
}