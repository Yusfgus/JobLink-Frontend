import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';

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
    ],
    templateUrl: './jobseeker-register.component.html',
    styleUrl: './jobseeker-register.component.scss'
})
export class JobseekerRegisterComponent {

    genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ];

    form: FormGroup;

    constructor(private fb: FormBuilder, private router: Router) {
        this.form = this.fb.group({
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            gender: [null, Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    onLinkedIn(): void {
        console.log('LinkedIn sign-up');
    }

    onGoogle(): void {
        console.log('Google sign-up');
    }

    onSubmit(): void {
        console.log('Form submitted', this.form.value);
        console.log('Form valid', this.form.valid);
        if (this.form.valid) {
            // console.log('Form submitted', this.form.value);
            // this.router.navigate(['/user/dashboard']);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
