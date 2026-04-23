import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'auth', pathMatch: 'full'
    },
    {
        path: 'user', component: UserLayoutComponent
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'welcome',
                pathMatch: 'full'
            },
            {
                path: 'welcome',
                loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent)
            },
            {
                path: 'login',
                loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                children: [
                    {
                        path: 'jobseeker',
                        loadComponent: () => import('./pages/jobseeker-register/jobseeker-register.component').then(m => m.JobseekerRegisterComponent)
                    },
                    {
                        path: 'employer',
                        loadComponent: () => import('./pages/employer-register/employer-register.component').then(m => m.EmployerRegisterComponent)
                    }
                ]
            }
        ]
    },
]
