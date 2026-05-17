import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AcademicGrade, Education } from '../../../../core/abstractions/jobseeker';
import { EducationService } from '../../../../core/services/jobseeker/education.service';
import { toDateOnly } from '../../../../shared/utils/date.utils';
import { EducationCardComponent } from '../../../../components/education-card/education-card.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-education',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DividerModule,
        DialogModule,
        ReactiveFormsModule,
        InputTextModule,
        CalendarModule,
        DropdownModule,
        EducationCardComponent
    ],
    templateUrl: './education.component.html',
    styleUrl: './education.component.scss'
})
export class EducationComponent {
    visible = false;
    educationForm: FormGroup;
    fb = inject(FormBuilder);
    _spinner = inject(NgxSpinnerService);

    educationService = inject(EducationService);
    educations = this.educationService.educations;

    academicGrades = Object.values(AcademicGrade).map(grade => ({ label: grade, value: grade }));

    constructor() {
        this.educationForm = this.fb.group({
            degree: ['', Validators.required],
            country: ['', Validators.required],
            institution: ['', Validators.required],
            fieldOfStudy: ['', Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            grade: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this._spinner.show();
        this.educationService.loadEducations().subscribe({
            next: () => this._spinner.hide(),
            error: () => this._spinner.hide()
        });
    }

    showDialog() {
        this.visible = true;
    }

    closeDialog() {
        this.visible = false;
        this.educationForm.reset();
    }

    saveEducation() {
        if (this.educationForm.valid) {
            const education: Education = {
                ...this.educationForm.value,
                startDate: toDateOnly(this.educationForm.value.startDate),
                endDate: toDateOnly(this.educationForm.value.endDate)
            };
            console.log('Saved Education:', education);
            // If we have an ID in the form value (meaning it's an edit), update it
            if (this.educationForm.value.id) {
                this.educationService.updateEducation(education).subscribe(() => {
                    this.closeDialog();
                });
            } else {
                this.educationService.addEducation(education).subscribe(() => {
                    this.closeDialog();
                });
            }
        }
    }

    editEducation(education: Education) {
        this.educationForm.patchValue({
            id: education.id,
            degree: education.degree,
            country: education.country,
            institution: education.institution,
            fieldOfStudy: education.fieldOfStudy,
            startDate: education.startDate ? new Date(education.startDate) : null,
            endDate: education.endDate ? new Date(education.endDate) : null,
            grade: education.grade
        });

        this.educationForm.addControl('id', this.fb.control(education.id));

        this.showDialog();
    }

    deleteEducation(id: string) {
        this.educationService.deleteEducation(id).subscribe();
    }
}
