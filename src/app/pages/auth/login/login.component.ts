import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { Login } from '../../../core/abstractions/login';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { TokenResponse } from '../../../core/abstractions/token-response';
import { UserRole } from '../../../core/abstractions/user-role';

import { NgxSpinnerService } from "ngx-spinner";
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { JobSeekerService } from '../../../core/services/jobseeker.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        CheckboxModule,
        DividerModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    constructor(
        private spinner: NgxSpinnerService,
        private router: Router,
        private authService: AuthService,
        private toastService: ToastService,
        private jobSeekerService: JobSeekerService,
    ) {
        this.initFormControls()
        this.initFormGroups()
    }

    email!: FormControl;
    password!: FormControl;
    remember!: FormControl;
    form!: FormGroup

    initFormControls(): void {
        this.email = new FormControl('', [Validators.required, Validators.email])
        this.password = new FormControl('', [Validators.required, Validators.minLength(6)])
        this.remember = new FormControl(false)
    }

    initFormGroups(): void {
        this.form = new FormGroup({
            email: this.email,
            password: this.password,
            remember: this.remember,
        })
    }

    onGoogle(): void {
        console.log('Google sign-in');
    }

    onLinkedIn(): void {
        console.log('LinkedIn sign-in');
    }

    onSubmit(): void {
        // console.log('Login submitted', this.form.value);
        if (this.form.valid) {
            const data: Login = {
                email: this.form.value.email,
                password: this.form.value.password
            };
            this.signIn(data);
        } else {
            this.form.markAllAsTouched();
        }
    }

    signIn(data: Login): void {
        this.spinner.show();
        this.authService.login(data).subscribe({
            next: (response: TokenResponse) => {
                console.log('Login response: ', response);

                this.toastService.success('Success', 'Logged in successfully')

                if (response.role === UserRole.JobSeeker) {
                    this.jobSeekerService.loadJobSeekerProfile().subscribe();
                    this.router.navigate(['/explore']);
                }
                else if (response.role === UserRole.Company) {
                    this.router.navigate(['/coming-soon']);
                }

                this.spinner.hide();

                if (this.remember.value) {
                    this.authService.setToken(response)
                }

            },
            error: (err) => {
                this.spinner.hide();
                console.log('Login error: ', err);
                this.toastService.error('Error', err.error.detail);
            }
        })
    }
}
