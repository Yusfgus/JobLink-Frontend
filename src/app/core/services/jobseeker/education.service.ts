import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { Education } from "../../abstractions/jobseeker";
import { environment } from "../../../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class EducationService {

    constructor(private _httpClient: HttpClient) { }

    private _educations = signal<Education[]>([]);
    educations = this._educations.asReadonly();

    loadEducations(): Observable<Education[]> {
        if (this._educations().length > 0) {
            return of(this._educations());
        }
        return this._httpClient.get<Education[]>(`${environment.apiRootUrl}/job-seekers/me/educations`)
            .pipe(
                tap((response) => {
                    this._educations.set(response);
                })
            );
    }

    getEducation(id: string): Observable<Education> {
        return this._httpClient.get<Education>(`${environment.apiRootUrl}/job-seekers/me/educations/${id}`);
    }

    addEducation(education: Education): Observable<string> {
        return this._httpClient.post<string>(`${environment.apiRootUrl}/job-seekers/me/educations`, education)
            .pipe(
                tap((id) => {
                    education.id = id;
                    this._educations.update(eds => [...eds, education]);
                })
            );
    }

    updateEducation(education: Education): Observable<void> {
        return this._httpClient.put<void>(`${environment.apiRootUrl}/job-seekers/me/educations/${education.id}`, education)
            .pipe(
                tap(() => {
                    this._educations.update(eds => eds.map(e => e.id === education.id ? education : e));
                })
            );
    }

    deleteEducation(id: string): Observable<void> {
        return this._httpClient.delete<void>(`${environment.apiRootUrl}/job-seekers/me/educations/${id}`)
            .pipe(
                tap(() => {
                    this._educations.update(eds => eds.filter(e => e.id !== id));
                })
            );
    }
}