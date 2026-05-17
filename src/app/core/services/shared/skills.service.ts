import { Injectable, signal } from "@angular/core";
import { Skill } from "../../abstractions/skill";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SkillsService {

    constructor(
        private _httpClient: HttpClient,
    ) { }

    private _skills = signal<Skill[]>([]);
    skills = this._skills.asReadonly();

    loadSkills(): Observable<Skill[]> {
        if (this._skills().length > 0) return of(this._skills());

        return this._httpClient.get<Skill[]>(`${environment.apiRootUrl}/skills`)
            .pipe(
                tap(skills => this._skills.set(skills)),
                catchError(err => {
                    console.error('Failed to load skills:', err);
                    return of([]);
                })
            );
    }

    getSkill(skillId: string): Observable<Skill> {
        const skill = this._skills().find(s => s.id === skillId);
        if (skill) return of(skill);

        return this._httpClient.get<Skill>(`${environment.apiRootUrl}/skills/${skillId}`)
            .pipe(
                tap(skill => this._skills.update(skills => [...skills, skill])),
                catchError(err => {
                    console.error(`Failed to load skill with ID ${skillId}:`, err);
                    return of({ id: skillId, name: 'Unknown' });
                })
            );
    }

    addSkill(skill: Skill): Observable<Skill> {
        return this._httpClient.post<Skill>(`${environment.apiRootUrl}/skills`, skill)
            .pipe(
                tap(skill => this._skills.update(skills => [...skills, skill]))
            );
    }

    updateSkill(skill: Skill): Observable<Skill> {
        return this._httpClient.put<Skill>(`${environment.apiRootUrl}/skills/${skill.id}`, skill)
            .pipe(
                tap(skill => this._skills.update(skills => skills.map(s => s.id === skill.id ? skill : s)))
            );
    }

    deleteSkill(skillId: string): Observable<void> {
        return this._httpClient.delete<void>(`${environment.apiRootUrl}/skills/${skillId}`)
            .pipe(
                tap(() => this._skills.update(skills => skills.filter(s => s.id !== skillId)))
            );
    }

}