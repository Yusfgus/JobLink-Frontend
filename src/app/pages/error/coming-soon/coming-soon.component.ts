import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss'
})
export class ComingSoonComponent {
  private router = inject(Router);

  @Input() showHomeButton: boolean = true;

  goToHome() {
    this.router.navigate(['/explore']);
  }
}
