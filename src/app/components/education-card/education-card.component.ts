import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Education } from '../../core/abstractions/jobseeker';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-education-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, DatePipe],
  templateUrl: './education-card.component.html',
  styleUrl: './education-card.component.scss'
})
export class EducationCardComponent {
  @Input({ required: true }) education!: Education;
  @Output() edit = new EventEmitter<Education>();
  @Output() delete = new EventEmitter<string>();

  onEdit() {
    this.edit.emit(this.education);
  }

  onDelete() {
    this.delete.emit(this.education.id);
  }
}

