import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JobSeekerSkill } from '../../abstractions/skill';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobSeekerSkillService {
    constructor(private _httpClient: HttpClient) { }

    private _skills = signal<JobSeekerSkill[]>([]);
    skills = this._skills.asReadonly();

    loadMySkills(): Observable<JobSeekerSkill[]> {
        if (this._skills().length > 0) {
            return of(this._skills());
        }
        return this._httpClient.get<JobSeekerSkill[]>(`${environment.apiRootUrl}/job-seekers/me/skills`)
            .pipe(
                tap((response) => {
                    this._skills.set(response);
                })
            );
    }

    getMySkill(id: string): Observable<JobSeekerSkill> {
        return this._httpClient.get<JobSeekerSkill>(`${environment.apiRootUrl}/job-seekers/me/skills/${id}`);
    }

    addMySkill(skill: JobSeekerSkill): Observable<string> {
        console.log('add skill', skill);
        return this._httpClient.post<string>(`${environment.apiRootUrl}/job-seekers/me/skills`, skill)
            .pipe(
                tap((id) => {
                    skill.id = id;
                    this._skills.update(skills => [...skills, skill]);
                })
            );
    }

    updateMySkill(skill: JobSeekerSkill): Observable<void> {
        return this._httpClient.put<void>(`${environment.apiRootUrl}/job-seekers/me/skills/${skill.id}`, skill)
            .pipe(
                tap(() => {
                    this._skills.update(skills => skills.map(s => s.id === skill.id ? skill : s));
                })
            );
    }

    deleteMySkill(id: string): Observable<void> {
        return this._httpClient.delete<void>(`${environment.apiRootUrl}/job-seekers/me/skills/${id}`)
            .pipe(
                tap(() => {
                    this._skills.update(skills => skills.filter(s => s.id !== id));
                })
            );
    }
}
