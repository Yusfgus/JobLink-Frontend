import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Application, ApplicationStatus, Job } from '../abstractions/job';
import { PagedResponse } from '../abstractions/pagedResponse';
import { AuthService } from './auth.service';
import { Paged } from '../abstractions/paged';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService extends Paged {

    constructor(
        private _httpClient: HttpClient,
    ) { super(); }

    jwtHeader: string = `Bearer ${inject(AuthService).getAccessToken()}`;

    visibleJobsLimit = 5;

    private _applicationsSubject: BehaviorSubject<Application[]> = new BehaviorSubject<Application[]>([]);
    applications$: Observable<Application[]> = this._applicationsSubject.asObservable();

    loadApplications(page: number = 1, page_size: number = 10): void {
        const startIndex = (page - 1) * page_size, endIndex = page * page_size - 1;
        if ((startIndex < this._applicationsSubject.value.length && endIndex < this._applicationsSubject.value.length)
            || !this._hasNext) {
            return;
        }
        this._httpClient.get<PagedResponse<Application>>(`${environment.apiRootUrl}/job-seekers/me/jobs/applied?page=${page}&pageSize=${page_size}`, { headers: { Authorization: this.jwtHeader } })
            .subscribe({
                next: (response: PagedResponse<Application>) => {
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
                    const application: Application = {
                        jobId: job.id,
                        jobTitle: job.title,
                        status: ApplicationStatus.Pending,
                        appliedAtUtc: new Date(),
                        companyId: job.companyId,
                        companyLogoUrl: job.companyLogoUrl,
                        companyName: job.companyName,
                        country: job.country,
                        city: job.city,
                    };
                    this._applicationsSubject.next([application, ...this._applicationsSubject.value]);
                    this._totalCount++;
                })
            );
    }

    withdrawApplication(job: Application): Observable<any> {
        return this._httpClient.delete<any>(`${environment.apiRootUrl}/jobs/${job.jobId}/withdraw`, { headers: { Authorization: this.jwtHeader } })
            .pipe(
                tap(() => {
                    this._applicationsSubject.next(this._applicationsSubject.value.filter(j => j.jobId !== job.jobId));
                    this._totalCount--;
                })
            );
    }
}