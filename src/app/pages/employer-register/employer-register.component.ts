import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-employer-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        DropdownModule,
        CheckboxModule,
    ],
    templateUrl: './employer-register.component.html',
    styleUrl: './employer-register.component.scss'
})
export class EmployerRegisterComponent {

    industryOptions = [
        { label: 'Technology & SaaS', value: 'tech' },
        { label: 'Creative & Design', value: 'creative' },
        { label: 'Finance & Fintech', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Education', value: 'education' },
    ];

    companySizeOptions = [
        { label: '1–10 employees', value: '1-10' },
        { label: '11–50 employees', value: '11-50' },
        { label: '51–200 employees', value: '51-200' },
        { label: '201–500 employees', value: '201-500' },
        { label: '500+ employees', value: '500+' },
    ];

    avatars = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBcU1mN2rV6IMbCx0f-xzknIaQMJCGM4AoeEZ648nsZvI8-uX8Z7y8WXrQX7sVoopUMfiyC3XIuzggPW8m9b2vU3pQn5rfVzAS7lAUVSyW-r90RM_DdRC0oHxi0t0_TRPGsb7Z2XKz5ITWCQfOEhzGUHp4eiCGdfrWmt3Iqiiyma-pxFAvFIX3zMhymAoAJog-4yAkUbIljGdW8hCiaG1nNxGf4Pf3FjrY34JJsN4B8boIBhKzTLzfgUPt8ia7eXSI-V5hlZRH9sMqQ',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBfOGsTjRDxvzj4WQsvSA0B0sPFoNbvBcC7YgiHBovjsdnXu-uKF4VuOj69qriruKBPwCGjl9ltW_Pe_Upwi5dbT6jsIGKRkaBnhqvLqiww9r7ovwPGgtHwGBSQIqMMODcTPqCnsEl2f6TtJdNrpVcLBDrDTByjZgI9eA8YF5MFKkZyQBBdTcZL0DTjs2JF6SOWRQzpGajCXd0iDD98UTgIXfqkoFDUsAs0p8bLOmoFB7rghf0EkVCQ92DV9T0HzyrQEypu_nB1hnwH',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDNmEm0XUBetSbbEUpyIla22UvZynU0aN55N1LBVCqD7KG6bhcGuhccWKfR9r7kCZTrNp5K8H-ZkqYvg0-QaVdxtep8AV6qos8Tary486Rt7gMWmPT6SjWwYzot1HehVy2HwDNQr54dpRAB0cSQg6xEcgiJu-OT_n8pxIhc3i4HTZcYT4_FX8QkL4GrmyTFjgI9wpO4DnVIRzbDszRDRwrm-Jb9HMznutJbq1MZuncRu1NWhk6EBd3NEyjZ8-rwcaFRtyTP4AgWfrFF',
    ];

    form: FormGroup;

    constructor(private fb: FormBuilder, private router: Router) {
        this.form = this.fb.group({
            companyName: ['', Validators.required],
            workEmail:   ['', [Validators.required, Validators.email]],
            industry:    [null, Validators.required],
            companySize: [null, Validators.required],
            password:    ['', [Validators.required, Validators.minLength(8)]],
            terms:       [false, Validators.requiredTrue],
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            console.log('Employer form submitted', this.form.value);
            // this.router.navigate(['/user/dashboard']);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
