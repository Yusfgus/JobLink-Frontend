import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobSummary } from '../interfaces/job';
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

    private _jobsSubject: BehaviorSubject<JobSummary[]> = new BehaviorSubject<JobSummary[]>([]);
    jobs: Observable<JobSummary[]> = this._jobsSubject.asObservable();
    _currentPage: number = 1;
    _pageSize: number = 10;
    _totalPages: number = 0;
    _totalCount: number = 0;
    _hasNext: boolean = true;
    _hasPrevious: boolean = false;

    load_applications(page: number = 1, page_size: number = 10): void {
        if (!this._hasNext) {
            return;
        }
        this._httpClient.get<PagedResponse<JobSummary>>(`${environment.apiRootUrl}/job-seekers/me/jobs/applied?page=${page}&pageSize=${page_size}`, { headers: { Authorization: this.jwtHeader } })
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
        return this._httpClient.post<any>(`${environment.apiRootUrl}/jobs/${job_id}/apply`, null, { headers: { Authorization: this.jwtHeader } });
    }
}