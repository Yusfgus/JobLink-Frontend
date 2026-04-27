import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobSummary } from '../interfaces/job';
import { PagedResponse } from '../interfaces/pagedResponse';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class JobService {

    constructor(private _httpClient: HttpClient, private _authService: AuthService) { }

    get_all_jobs(page: number = 1, page_size: number = 10): Observable<PagedResponse<JobSummary>> {
        return this._httpClient.get<PagedResponse<JobSummary>>(`${environment.apiRootUrl}/jobs?page=${page}&pageSize=${page_size}`, {
            headers: {
                Authorization: `Bearer ${this._authService.getAccessToken()}`
            }
        });
    }

    get_saved_jobs(page: number = 1, page_size: number = 10): Observable<PagedResponse<JobSummary>> {
        return this._httpClient.get<PagedResponse<JobSummary>>(`${environment.apiRootUrl}/job-seekers/me/jobs/saved?page=${page}&pageSize=${page_size}`, {
            headers: {
                Authorization: `Bearer ${this._authService.getAccessToken()}`
            }
        });
    }

    apply_for_job(job_id: string): Observable<void> {
        return this._httpClient.post<void>(`${environment.apiRootUrl}/jobs/${job_id}/apply`, null, {
            headers: {
                Authorization: `Bearer ${this._authService.getAccessToken()}`
            }
        });
    }

    save_job(job_id: string): Observable<void> {
        return this._httpClient.post<void>(`${environment.apiRootUrl}/jobs/${job_id}/save`, null, {
            headers: {
                Authorization: `Bearer ${this._authService.getAccessToken()}`
            }
        });
    }

    unsave_job(job_id: string): Observable<void> {
        return this._httpClient.delete<void>(`${environment.apiRootUrl}/jobs/${job_id}/unsave`, {
            headers: {
                Authorization: `Bearer ${this._authService.getAccessToken()}`
            }
        });
    }
}