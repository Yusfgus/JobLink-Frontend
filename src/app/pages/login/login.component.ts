import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            email:    ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            remember: [false],
        });
    }

    onGoogle(): void {
        console.log('Google sign-in');
    }

    onLinkedIn(): void {
        console.log('LinkedIn sign-in');
    }

    onSubmit(): void {
        if (this.form.valid) {
            console.log('Login submitted', this.form.value);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
