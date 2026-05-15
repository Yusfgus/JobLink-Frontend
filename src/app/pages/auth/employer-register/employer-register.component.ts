import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { EmployerRegister } from '../../../core/abstractions/employer';
import { TokenResponse } from '../../../core/abstractions/token-response';

import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
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
        CheckboxModule
    ],
    templateUrl: './employer-register.component.html',
    styleUrl: './employer-register.component.scss'
})
export class EmployerRegisterComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private spinner: NgxSpinnerService,
        private authService: AuthService,
        private toastService: ToastService
    ) {
        this.initFormControls();
        this.initFormGroup();
    }

    form!: FormGroup;
    companyName!: FormControl;
    workEmail!: FormControl;
    industry!: FormControl;
    companySize!: FormControl;
    password!: FormControl;
    terms!: FormControl;

    initFormControls(): void {
        this.companyName = new FormControl('', Validators.required);
        this.workEmail = new FormControl('', [Validators.required, Validators.email]);
        this.industry = new FormControl(null, Validators.required);
        this.companySize = new FormControl(null, Validators.required);
        this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
        this.terms = new FormControl(false, Validators.requiredTrue);
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            companyName: this.companyName,
            workEmail: this.workEmail,
            industry: this.industry,
            companySize: this.companySize,
            password: this.password,
            terms: this.terms,
        });
    }

    industryOptions = [
        { label: 'Technology & SaaS', value: 'tech' },
        { label: 'Creative & Design', value: 'creative' },
        { label: 'Finance & Fintech', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Education', value: 'education' },
    ];

    companySizeOptions = [
        { label: '1-10 employees', value: '1-10' },
        { label: '11-50 employees', value: '11-50' },
        { label: '51-200 employees', value: '51-200' },
        { label: '201-500 employees', value: '201-500' },
        { label: '500+ employees', value: '500+' },
    ];

    avatars = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBcU1mN2rV6IMbCx0f-xzknIaQMJCGM4AoeEZ648nsZvI8-uX8Z7y8WXrQX7sVoopUMfiyC3XIuzggPW8m9b2vU3pQn5rfVzAS7lAUVSyW-r90RM_DdRC0oHxi0t0_TRPGsb7Z2XKz5ITWCQfOEhzGUHp4eiCGdfrWmt3Iqiiyma-pxFAvFIX3zMhymAoAJog-4yAkUbIljGdW8hCiaG1nNxGf4Pf3FjrY34JJsN4B8boIBhKzTLzfgUPt8ia7eXSI-V5hlZRH9sMqQ',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBfOGsTjRDxvzj4WQsvSA0B0sPFoNbvBcC7YgiHBovjsdnXu-uKF4VuOj69qriruKBPwCGjl9ltW_Pe_Upwi5dbT6jsIGKRkaBnhqvLqiww9r7ovwPGgtHwGBSQIqMMODcTPqCnsEl2f6TtJdNrpVcLBDrDTByjZgI9eA8YF5MFKkZyQBBdTcZL0DTjs2JF6SOWRQzpGajCXd0iDD98UTgIXfqkoFDUsAs0p8bLOmoFB7rghf0EkVCQ92DV9T0HzyrQEypu_nB1hnwH',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDNmEm0XUBetSbbEUpyIla22UvZynU0aN55N1LBVCqD7KG6bhcGuhccWKfR9r7kCZTrNp5K8H-ZkqYvg0-QaVdxtep8AV6qos8Tary486Rt7gMWmPT6SjWwYzot1HehVy2HwDNQr54dpRAB0cSQg6xEcgiJu-OT_n8pxIhc3i4HTZcYT4_FX8QkL4GrmyTFjgI9wpO4DnVIRzbDszRDRwrm-Jb9HMznutJbq1MZuncRu1NWhk6EBd3NEyjZ8-rwcaFRtyTP4AgWfrFF',
    ];

    onSubmit(): void {
        // console.log('Employer form submitted', this.form.value);
        if (this.form.valid) {
            const data: EmployerRegister = {
                name: this.form.value.companyName,
                email: this.form.value.workEmail,
                industry: this.form.value.industry,
                // companySize: this.form.value.companySize,
                password: this.form.value.password
            }
            this.signUp(data);
        } else {
            this.form.markAllAsTouched();
        }
    }

    signUp(registerData: EmployerRegister): void {
        this.spinner.show()
        this.authService.employer_register(registerData)
            .subscribe({
                next: (response: TokenResponse) => {
                    console.log(response)

                    this.toastService.success('Success', 'Registered successfully')

                    this.router.navigate(['/coming-soon'])

                    this.spinner.hide()
                },
                error: (response) => {
                    this.spinner.hide()
                    console.log(response)
                    this.toastService.error('Error', response.error.detail)
                },
            })
    }
}
