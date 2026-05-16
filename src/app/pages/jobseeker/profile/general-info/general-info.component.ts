import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { JobSeekerService } from '../../../../core/services/jobseeker/jobseeker.service';
import { Gender, JobSeekerProfile, MaritalStatus, MilitaryStatus } from '../../../../core/abstractions/jobseeker';
import { SelectItem } from 'primeng/api';
import { ToastService } from '../../../../core/services/ui/toast.service';
import { ApiErrorResponse } from '../../../../core/abstractions/response';

@Component({
    selector: 'app-general-info',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        DividerModule,
        CalendarModule,
        DropdownModule,
    ],
    templateUrl: './general-info.component.html',
    styleUrl: './general-info.component.scss'
})
export class GeneralInfoComponent {
    private readonly jobSeekerService = inject(JobSeekerService);
    private readonly toastService = inject(ToastService);

    profile = this.jobSeekerService.profile;

    ngOnInit(): void {
        this.initOptions();
        this.initFormControls();
        this.initForm();
    }

    initOptions(): void {
        this.genderOptions = Object.values(Gender).map((gender) => ({ label: gender, value: gender }));
        this.maritalStatusOptions = Object.values(MaritalStatus).map((maritalStatus) => ({ label: maritalStatus, value: maritalStatus }));
        this.militaryStatusOptions = Object.values(MilitaryStatus).map((militaryStatus) => ({ label: militaryStatus, value: militaryStatus }));
    }

    saving = false;

    genderOptions: SelectItem[] = [];
    maritalStatusOptions: SelectItem[] = [];
    militaryStatusOptions: SelectItem[] = [];

    form!: FormGroup;
    firstName!: FormControl;
    middleName!: FormControl;
    lastName!: FormControl;
    nationality!: FormControl;
    mobileNumber!: FormControl;
    birthDate!: FormControl;
    gender!: FormControl;
    maritalStatus!: FormControl;
    militaryStatus!: FormControl;
    country!: FormControl;
    city!: FormControl;
    area!: FormControl;
    summary!: FormControl;

    initFormControls(): void {
        this.firstName = new FormControl(this.profile()?.firstName);
        this.middleName = new FormControl(this.profile()?.middleName);
        this.lastName = new FormControl(this.profile()?.lastName);
        this.nationality = new FormControl(this.profile()?.nationality);
        this.mobileNumber = new FormControl(this.profile()?.mobileNumber);
        this.birthDate = new FormControl(this.profile()?.birthDate ? new Date(this.profile()!.birthDate!) : '');
        this.gender = new FormControl(this.profile()?.gender);
        this.maritalStatus = new FormControl(this.profile()?.maritalStatus);
        this.militaryStatus = new FormControl(this.profile()?.militaryStatus);
        this.country = new FormControl(this.profile()?.country);
        this.city = new FormControl(this.profile()?.city);
        this.area = new FormControl(this.profile()?.area);
        this.summary = new FormControl(this.profile()?.summary);
    }

    initForm(): void {
        this.form = new FormGroup({
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            nationality: this.nationality,
            mobileNumber: this.mobileNumber,
            birthDate: this.birthDate,
            gender: this.gender,
            maritalStatus: this.maritalStatus,
            militaryStatus: this.militaryStatus,
            country: this.country,
            city: this.city,
            area: this.area,
            summary: this.summary,
        });
    }

    onSave(): void {
        this.saving = true;

        // date only
        if (this.form.value.birthDate) {
            this.form.value.birthDate = this.form.value.birthDate.toISOString().split('T')[0];
        }

        let updatedJobSeekerProfile: JobSeekerProfile = this.form.value;

        this.jobSeekerService.updateJobSeekerProfile(updatedJobSeekerProfile)
            .subscribe({
                next: () => {
                    this.toastService.success('Success', 'Profile updated successfully');
                    this.form.markAsPristine();
                    this.saving = false;
                },
                error: (error: ApiErrorResponse) => {
                    this.toastService.error(error.title, error.detail);
                    this.saving = false;
                }
            });
    }
}
