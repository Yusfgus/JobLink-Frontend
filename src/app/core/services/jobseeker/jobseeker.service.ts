import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { JobSeekerProfile } from '../../abstractions/jobseeker';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobSeekerService {
    private readonly _http = inject(HttpClient);

    private readonly _profile = signal<JobSeekerProfile | null>(null);
    private readonly _isLoaded = signal<boolean>(false);

    readonly profile = this._profile.asReadonly();
    readonly isLoaded = this._isLoaded.asReadonly();

    private _syncState(profile: JobSeekerProfile | null) {
        this._profile.set(profile);
        if (profile) this._isLoaded.set(true);
    }

    loadJobSeekerProfile(): Observable<JobSeekerProfile | null> {
        if (this.isLoaded()) {
            return of(this.profile());
        }

        return this._http.get<JobSeekerProfile>(`${environment.apiRootUrl}/job-seekers/me`)
            .pipe(
                tap(profile => this._syncState(profile)),
                catchError(() => {
                    this._syncState(null);
                    return of(null);
                })
            );
    }

    updateJobSeekerProfile(profile: JobSeekerProfile): Observable<void> {
        return this._http.put<void>(`${environment.apiRootUrl}/job-seekers/me`, profile)
            .pipe(
                tap(() => this._syncState(profile))
            );
    }

    clearJobSeekerProfile(): void {
        this._syncState(null);
        this._isLoaded.set(false);
    }

}

