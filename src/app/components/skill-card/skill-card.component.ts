import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { JobSeekerSkill, SkillLevel } from '../../core/abstractions/skill';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './skill-card.component.html',
  styleUrl: './skill-card.component.scss'
})
export class SkillCardComponent {
  @Input({ required: true }) skill!: JobSeekerSkill;
  @Output() edit = new EventEmitter<JobSeekerSkill>();
  @Output() delete = new EventEmitter<string>();

  getSkillLevelClass(level: SkillLevel | string): string {
    switch (level) {
      case 'Beginner': return 'level-beginner';
      case 'Intermediate': return 'level-intermediate';
      case 'Advanced': return 'level-advanced';
      case 'Expert': return 'level-expert';
      default: return '';
    }
  }

  onEdit() {
      this.edit.emit(this.skill);
  }

  onDelete() {
      this.delete.emit(this.skill.id);
  }
}
