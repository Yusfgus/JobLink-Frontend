import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { JobseekerLayoutComponent } from './layouts/jobseeker-layout/jobseeker-layout.component';
import { jobSeekerAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '', redirectTo: 'explore', pathMatch: 'full'
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
                loadComponent: () => import('./pages/auth/welcome/welcome.component').then(m => m.WelcomeComponent)
            },
            {
                path: 'login',
                loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                children: [
                    {
                        path: 'jobseeker',
                        loadComponent: () => import('./pages/auth/jobseeker-register/jobseeker-register.component').then(m => m.JobseekerRegisterComponent)
                    },
                    {
                        path: 'employer',
                        loadComponent: () => import('./pages/auth/employer-register/employer-register.component').then(m => m.EmployerRegisterComponent)
                    },
                    {
                        path: '',
                        redirectTo: 'jobseeker',
                        pathMatch: 'full'
                    }
                ]
            }
        ]
    },
    {
        path: '',
        canActivateChild: [jobSeekerAuthGuard],
        component: JobseekerLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'explore',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                redirectTo: '/coming-soon',
                // loadComponent: () => import('./pages/jobseeker/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'explore',
                loadComponent: () => import('./pages/jobseeker/explore/explore.component').then(m => m.ExploreComponent)
            },
            {
                path: 'applications',
                loadComponent: () => import('./pages/jobseeker/applications/applications.component').then(m => m.ApplicationsComponent)
            },
            {
                path: 'saved-jobs',
                loadComponent: () => import('./pages/jobseeker/saved-jobs/saved-jobs.component').then(m => m.SavedJobsComponent)
            },
            {
                path: 'job/:id',
                loadComponent: () => import('./pages/jobseeker/job-page/job-page.component').then(m => m.JobPageComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/jobseeker/profile/layout/layout.component').then(m => m.LayoutComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'general-info',
                        pathMatch: 'full'
                    },
                    {
                        path: 'general-info',
                        loadComponent: () => import('./pages/jobseeker/profile/general-info/general-info.component').then(m => m.GeneralInfoComponent)
                    },
                    {
                        path: 'resume',
                        loadComponent: () => import('./pages/jobseeker/profile/resume/resume.component').then(m => m.ResumeComponent)
                    },
                    {
                        path: 'education',
                        loadComponent: () => import('./pages/jobseeker/profile/education/education.component').then(m => m.EducationComponent)
                    },
                    {
                        path: 'experience',
                        loadComponent: () => import('./pages/jobseeker/profile/experience/experience.component').then(m => m.ExperienceComponent)
                    },
                    {
                        path: 'skills',
                        loadComponent: () => import('./pages/jobseeker/profile/skills/skills.component').then(m => m.SkillsComponent)
                    },
                ]
            },
            {
                path: 'settings',
                redirectTo: '/coming-soon',
                // loadComponent: () => import('./pages/jobseeker/settings/settings.component').then(m => m.SettingsComponent)
            }
        ]
    },
    {
        path: 'coming-soon',
        loadComponent: () => import('./pages/error/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
    },
    {
        path: 'not-found',
        loadComponent: () => import('./pages/error/not-found/not-found.component').then(m => m.NotFoundComponent)
    },
    {
        path: '**',
        redirectTo: 'not-found'
    }
]
