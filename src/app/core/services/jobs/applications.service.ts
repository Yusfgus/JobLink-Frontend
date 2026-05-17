import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Application, ApplicationStatus, Job } from '../../abstractions/job';
import { PagedResponse } from '../../abstractions/pagedResponse';
import { Paged } from '../../abstractions/paged';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService extends Paged {

    constructor(
        private _httpClient: HttpClient,
    ) { super(); }

    visibleJobsLimit = 5;

    private _applications = signal<Application[]>([]);
    applications = this._applications.asReadonly();

    loadApplications(page: number = 1, page_size: number = 10): Observable<PagedResponse<Application>> | void {
        const startIndex = (page - 1) * page_size, endIndex = page * page_size - 1;
        if ((startIndex < this._applications().length && endIndex < this._applications().length)
            || !this._hasNext) {
            return;
        }
        return this._httpClient.get<PagedResponse<Application>>(`${environment.apiRootUrl}/job-seekers/me/jobs/applied?page=${page}&pageSize=${page_size}`)
            .pipe(
                tap((response: PagedResponse<Application>) => {
                    this._applications.update(apps => [...apps, ...response.items]);
                    this._currentPage = response.pageNumber;
                    this._totalPages = response.totalPages;
                    this._totalCount = response.totalCount;
                    this._hasNext = response.hasNextPage;
                    this._hasPrevious = response.hasPreviousPage;
                })
            );
    }

    applyForJob(job: Job): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiRootUrl}/jobs/${job.id}/apply`, null)
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
                    this._applications.update(apps => [application, ...apps]);
                    this._totalCount++;
                })
            );
    }

    withdrawApplication(jobId: string): Observable<any> {
        return this._httpClient.delete<any>(`${environment.apiRootUrl}/jobs/${jobId}/withdraw`)
            .pipe(
                tap(() => {
                    this._applications.update(apps => apps.filter(j => j.jobId !== jobId));
                    this._totalCount--;
                })
            );
    }
}