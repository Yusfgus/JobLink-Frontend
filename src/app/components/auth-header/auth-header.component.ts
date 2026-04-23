import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-auth-header',
    standalone: true,
    imports: [RouterLink, ButtonModule],
    templateUrl: './auth-header.component.html',
    styleUrl: './auth-header.component.scss'
})
export class AuthHeaderComponent {
    private router = inject(Router);

    // 1. Create a signal that tracks the current URL
    private currentUrl = toSignal(
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            map((event: NavigationEnd) => event.urlAfterRedirects)
        ),
        { initialValue: this.router.url }
    );

    // 2. Compute the button properties based on the URL
    navAction = computed(() => {
        const url = this.currentUrl();

        if (url.includes('/login')) {
            return { label: 'Sign Up', link: 'welcome', icon: 'pi pi-user-plus', prompt: 'Don\'t have an account?' };
        }

        // Default to Login if we are on /register or anywhere else
        return { label: 'Log In', link: 'login', icon: 'pi pi-sign-in', prompt: 'Already have an account?' };
    });
}
