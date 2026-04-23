import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';

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
        private router: Router
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
            this.signIn();
        } else {
            this.form.markAllAsTouched();
        }
    }

    signIn(): void {
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 2000);
    }
}
