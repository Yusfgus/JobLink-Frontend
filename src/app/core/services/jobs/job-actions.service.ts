import { inject, Injectable } from "@angular/core";
import { Job } from '../../abstractions/job';
import { JobService } from './explore-page.service';
import { SavedJobService } from './saved-jobs.service';
import { ApplicationsService } from './applications.service';
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class JobActionsService {
    protected _jobService: JobService = inject(JobService);
    private _savedJobService: SavedJobService = inject(SavedJobService);
    private _applicationService: ApplicationsService = inject(ApplicationsService);

    apply(job: Job): Observable<any> {
        return this._applicationService.applyForJob(job).pipe(
            tap(() => {
                this._jobService.updateAppliedStatus(job.id, true);
                this._savedJobService.updateAppliedStatus(job.id, true);
            })
        );
    }

    withdrawApplication(jobId: string): Observable<any> {
        return this._applicationService.withdrawApplication(jobId).pipe(
            tap(() => {
                this._jobService.updateAppliedStatus(jobId, false);
                this._savedJobService.updateAppliedStatus(jobId, false);
            })
        );
    }

    save(job: Job): Observable<any> {
        return this._savedJobService.saveJob(job).pipe(
            tap(() => {
                this._jobService.updateSavedStatus(job.id, true);
            })
        );
    }

    unsave(job: Job): Observable<any> {
        return this._savedJobService.unsave_job(job).pipe(
            tap(() => {
                this._jobService.updateSavedStatus(job.id, false);
            })
        );
    }

}