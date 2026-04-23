import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-auth-footer',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
    templateUrl: './auth-footer.component.html',
    styleUrl: './auth-footer.component.scss'
})
export class AuthFooterComponent {
    currentYear = new Date().getFullYear();

    newsletterEmail = '';

    onSubscribe(): void {
        if (this.newsletterEmail) {
            console.log('Newsletter subscribed:', this.newsletterEmail);
            this.newsletterEmail = '';
        }
    }
}
