import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ProfilePictureService {
    private readonly _http = inject(HttpClient);

    private readonly _profilePictureUrl = signal<string | null>(null);

    readonly profilePictureUrl = this._profilePictureUrl.asReadonly();

    private _syncPicture(url: string | null) {
        this._profilePictureUrl.set(url);
    }

    loadProfilePicture(): Observable<string | null> {
        return this._http.get<{ profilePictureUrl: string | null; }>(`${environment.apiRootUrl}/job-seekers/me/picture`)
            .pipe(
                map(res => res.profilePictureUrl),
                tap(url => this._syncPicture(url)),
                catchError(() => {
                    this._syncPicture(null);
                    return of(null);
                })
            );
    }

    uploadProfilePicture(file: File): Observable<{ profilePictureUrl: string; }> {
        const formData = new FormData();
        formData.append('profilePicture', file);

        return this._http.post<{ profilePictureUrl: string; }>(`${environment.apiRootUrl}/job-seekers/me/picture`, formData)
            .pipe(
                tap(res => this._syncPicture(res.profilePictureUrl))
            );
    }

    deleteProfilePicture(): Observable<void> {
        return this._http.delete<void>(`${environment.apiRootUrl}/job-seekers/me/picture`)
            .pipe(
                tap(() => this._syncPicture(null))
            );
    }

}
