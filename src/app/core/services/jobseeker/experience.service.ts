import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Experience } from '../../abstractions/jobseeker';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ExperienceService {
    constructor(private _httpClient: HttpClient) { }

    private _experiences = signal<Experience[]>([]);
    experiences = this._experiences.asReadonly();

    loadExperiences(): Observable<Experience[]> {
        if (this._experiences().length > 0) {
            return of(this._experiences());
        }
        return this._httpClient.get<any[]>(`${environment.apiRootUrl}/job-seekers/me/experiences`)
            .pipe(
                tap((response) => {
                    this._experiences.set(response);
                })
            );
    }

    getExperience(id: string): Observable<Experience> {
        return this._httpClient.get<any>(`${environment.apiRootUrl}/job-seekers/me/experiences/${id}`);
    }

    addExperience(experience: Experience): Observable<string> {
        return this._httpClient.post<string>(`${environment.apiRootUrl}/job-seekers/me/experiences`, experience)
            .pipe(
                tap((id) => {
                    experience.id = id;
                    this._experiences.update(exps => [...exps, experience]);
                })
            );
    }

    updateExperience(experience: Experience): Observable<void> {
        return this._httpClient.put<void>(`${environment.apiRootUrl}/job-seekers/me/experiences/${experience.id}`, experience)
            .pipe(
                tap(() => {
                    this._experiences.update(exps => exps.map(e => e.id === experience.id ? experience : e));
                })
            );
    }

    deleteExperience(id: string): Observable<void> {
        return this._httpClient.delete<void>(`${environment.apiRootUrl}/job-seekers/me/experiences/${id}`)
            .pipe(
                tap(() => {
                    this._experiences.update(exps => exps.filter(e => e.id !== id));
                })
            );
    }
}
