import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Experience } from '../../core/abstractions/jobseeker';

@Component({
  selector: 'app-experience-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, DatePipe, CurrencyPipe],
  templateUrl: './experience-card.component.html',
  styleUrl: './experience-card.component.scss'
})
export class ExperienceCardComponent {
  @Input({ required: true }) experience!: Experience;
  @Output() edit = new EventEmitter<Experience>();
  @Output() delete = new EventEmitter<string>();

  get duration() {
      const start = new Date(this.experience.startDate);
      const end = this.experience.endDate ? new Date(this.experience.endDate) : new Date();
      const diff = end.getTime() - start.getTime();
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      const remainingMonths = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
      
      let res = [];
      if (years > 0) res.push(`${years} yr${years > 1 ? 's' : ''}`);
      if (remainingMonths > 0) res.push(`${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`);
      return res.join(' ') || '1 mo';
  }

  onEdit() {
      this.edit.emit(this.experience);
  }

  onDelete() {
      this.delete.emit(this.experience.id);
  }
}
