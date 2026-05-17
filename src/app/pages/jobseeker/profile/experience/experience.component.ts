import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { Experience } from '../../../../core/abstractions/jobseeker';
import { ExperienceService } from '../../../../core/services/jobseeker/experience.service';
import { toDateOnly } from '../../../../shared/utils/date.utils';
import { ExperienceCardComponent } from '../../../../components/experience-card/experience-card.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-experience',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DividerModule,
        DialogModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        CalendarModule,
        InputNumberModule,
        ExperienceCardComponent
    ],
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
    visible = false;
    experienceForm: FormGroup;
    fb = inject(FormBuilder);
    _spinner = inject(NgxSpinnerService);

    experienceService = inject(ExperienceService);
    experiences = this.experienceService.experiences;

    constructor() {
        this.experienceForm = this.fb.group({
            company: ['', Validators.required],
            position: ['', Validators.required],
            country: ['', Validators.required],
            description: [''],
            salary: [null, [Validators.required, Validators.min(0)]],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this._spinner.show();
        this.experienceService.loadExperiences().subscribe({
            next: () => this._spinner.hide(),
            error: () => this._spinner.hide()
        });
    }

    showDialog() {
        this.visible = true;
    }

    closeDialog() {
        this.visible = false;
        this.experienceForm.reset();
        this.experienceForm.removeControl('id');
    }

    saveExperience() {
        if (this.experienceForm.valid) {
            const experience: Experience = {
                ...this.experienceForm.value,
                startDate: toDateOnly(this.experienceForm.value.startDate),
                endDate: toDateOnly(this.experienceForm.value.endDate)
            };
            console.log('experience: ', experience);

            if (this.experienceForm.value.id) {
                this.experienceService.updateExperience(experience).subscribe(() => {
                    this.closeDialog();
                });
            } else {
                this.experienceService.addExperience(experience).subscribe(() => {
                    this.closeDialog();
                });
            }
        } else {
            this.experienceForm.markAllAsTouched();
        }
    }

    editExperience(experience: Experience) {
        this.experienceForm.patchValue({
            company: experience.company,
            position: experience.position,
            country: experience.country,
            description: experience.description,
            salary: experience.salary,
            startDate: experience.startDate ? new Date(experience.startDate) : null,
            endDate: experience.endDate ? new Date(experience.endDate) : null
        });

        if (!this.experienceForm.contains('id')) {
            this.experienceForm.addControl('id', this.fb.control(experience.id));
        } else {
            this.experienceForm.get('id')?.setValue(experience.id);
        }

        this.showDialog();
    }

    deleteExperience(id: string) {
        this.experienceService.deleteExperience(id).subscribe();
    }
}
