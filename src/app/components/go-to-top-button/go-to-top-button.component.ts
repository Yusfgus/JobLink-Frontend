import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { fromEvent, map, distinctUntilChanged, Observable, of, shareReplay } from 'rxjs';

@Component({
  selector: 'app-go-to-top-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './go-to-top-button.component.html',
  styleUrl: './go-to-top-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' })),
      ]),
    ]),
  ],
})
export class GoToTopButtonComponent {
  showButton$: Observable<boolean> = of(false);
  private readonly SCROLL_THRESHOLD = 300;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.showButton$ = fromEvent(window, 'scroll').pipe(
        map(() => window.scrollY > this.SCROLL_THRESHOLD),
        distinctUntilChanged(),
        shareReplay(1)
      );
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}
