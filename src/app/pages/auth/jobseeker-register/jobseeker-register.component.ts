import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { JobseekerRegister } from '../../../core/interfaces/jobseeker-register';
import { TokenResponse } from '../../../core/interfaces/token-response';
import { AuthService } from '../../../core/services/auth.service';

import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-jobseeker-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        DropdownModule,
        DividerModule,
        NgxSpinnerModule
    ],
    templateUrl: './jobseeker-register.component.html',
    styleUrl: './jobseeker-register.component.scss'
})
export class JobseekerRegisterComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private spinner: NgxSpinnerService,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.initFormControls();
        this.initFormGroup();
    }

    genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ];

    form!: FormGroup;
    firstName!: FormControl;
    middleName!: FormControl;
    lastName!: FormControl;
    email!: FormControl;
    gender!: FormControl;
    password!: FormControl;

    initFormControls(): void {
        this.firstName = new FormControl('', Validators.required);
        this.middleName = new FormControl('');
        this.lastName = new FormControl('', Validators.required);
        this.email = new FormControl('', [Validators.required, Validators.email]);
        this.gender = new FormControl('', Validators.required);
        this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            email: this.email,
            gender: this.gender,
            password: this.password
        });
    }

    onLinkedIn(): void {
        console.log('LinkedIn sign-up');
    }

    onGoogle(): void {
        console.log('Google sign-up');
    }

    onSubmit(): void {
        // console.log('Form submitted', this.form.value);
        if (this.form.valid) {
            const data: JobseekerRegister = {
                email: this.form.value.email,
                password: this.form.value.password,
                firstName: this.form.value.firstName,
                middleName: this.form.value.middleName,
                lastName: this.form.value.lastName,
                gender: this.form.value.gender
            }
            this.signUp(data)
        } else {
            this.form.markAllAsTouched();
        }
    }

    signUp(registerData: JobseekerRegister): void {
        this.spinner.show()
        this.authService.jobseeker_register(registerData)
            .subscribe({
                next: (response: TokenResponse) => {
                    console.log(response)
                    this.authService.setToken(response)
                    this.authService.setRole('JobSeeker')
                    // this._userData.username.next('Yusfgus')

                    this.notify('success', 'Success', 'Registered successfully')
                    // this.router.navigate(['home'])
                    this.spinner.hide()
                },
                error: (response) => {
                    this.spinner.hide()
                    this.notify('error', 'Error', response.error.detail)
                },
            })
    }

    notify(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 })
    }

}
