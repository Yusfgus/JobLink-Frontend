import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { JobSeekerResume } from '../../abstractions/jobseeker';

@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private readonly _http = inject(HttpClient);

    private readonly _resume = signal<JobSeekerResume | null>(null);

    readonly resume = this._resume.asReadonly();

    private _syncResume(resume: JobSeekerResume | null) {
        this._resume.set(resume);
    }

    loadResume(): Observable<JobSeekerResume | null> {
        return this._http.get<JobSeekerResume | null>(`${environment.apiRootUrl}/job-seekers/me/resume`)
            .pipe(
                tap(resume => this._syncResume(resume)),
                catchError(() => {
                    this._syncResume(null);
                    return of(null);
                })
            );
    }

    uploadResume(file: File): Observable<JobSeekerResume> {
        const formData = new FormData();
        formData.append('resume', file);

        return this._http.post<JobSeekerResume>(`${environment.apiRootUrl}/job-seekers/me/resume`, formData)
            .pipe(
                tap(res => this._syncResume(res))
            );
    }

    deleteResume(): Observable<void> {
        return this._http.delete<void>(`${environment.apiRootUrl}/job-seekers/me/resume`)
            .pipe(
                tap(() => this._syncResume(null))
            );
    }

}
