import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { Login } from '../../../core/interfaces/login';
import { AuthService } from '../../../core/services/auth.service';
import { TokenResponse } from '../../../core/interfaces/token-response';

import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';

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
        DividerModule,
        NgxSpinnerModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    constructor(
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private router: Router,
        private authService: AuthService,
        private messageService: MessageService
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

                this.authService.setRole('JobSeeker')
                if (this.remember.value) {
                    this.authService.setToken(response)
                }
                this.notify('success', 'Success', 'Logged in successfully')
                // this.router.navigate(['/']);
                this.spinner.hide();
            },
            error: (err) => {
                this.spinner.hide();
                console.log('Login error: ', err);
                this.notify('error', 'Error', err.error.detail);
            }
        })
    }

    notify(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 })
    }
}
