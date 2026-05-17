import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { JobSeekerSkill, SkillLevel } from '../../../../core/abstractions/skill';
import { JobSeekerSkillService } from '../../../../core/services/jobseeker/jobseeker-skills.service';
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SkillsService } from '../../../../core/services/shared/skills.service';
import { SkillCardComponent } from '../../../../components/skill-card/skill-card.component';

@Component({
    selector: 'app-skills',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DividerModule,
        DialogModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        SkillCardComponent
    ],
    templateUrl: './skills.component.html',
    styleUrl: './skills.component.scss'
})
export class SkillsComponent {
    visible = false;
    skillForm: FormGroup;
    fb = inject(FormBuilder);
    _spinner = inject(NgxSpinnerService);

    jobSeekerSkillService = inject(JobSeekerSkillService);
    jobSeekerSkills = this.jobSeekerSkillService.skills;

    skillsService = inject(SkillsService);

    allSkills: { label: string; value: string; }[] = [];
    skillLevels = Object.values(SkillLevel).map(level => ({ label: level, value: level }));

    constructor() {
        this.skillForm = this.fb.group({
            skillName: ['', Validators.required],
            skillLevel: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this._spinner.show();
        this.jobSeekerSkillService.loadMySkills().subscribe({
            next: () => this._spinner.hide(),
            error: () => this._spinner.hide()
        });
    }

    showDialog() {
        this.visible = true;
        if (this.allSkills.length === 0) {
            this.allSkills = this.skillsService.skills().map(s => ({ label: s.name, value: s.id }));
        }
    }

    closeDialog() {
        this.visible = false;
        this.skillForm.reset();
    }

    saveSkill() {
        if (this.skillForm.valid) {
            const skillId = this.skillForm.get('skillName')?.value as string;
            const skill: JobSeekerSkill = {
                id: this.skillForm.value.id,
                skillId: skillId,
                skillLevel: this.skillForm.get('skillLevel')?.value,
                skillName: this.allSkills.find(x => x.value === skillId)?.label ?? ''
            };

            if (this.skillForm.value.id) {
                this.jobSeekerSkillService.updateMySkill(skill).subscribe(() => {
                    this.closeDialog();
                });
            } else {
                this.jobSeekerSkillService.addMySkill(skill).subscribe(() => {
                    this.closeDialog();
                });
            }
        }
    }

    editSkill(skill: JobSeekerSkill) {
        this.skillForm.patchValue({
            skillName: skill.skillId,
            skillLevel: skill.skillLevel
        });
        this.skillForm.addControl('id', this.fb.control(skill.id));
        this.showDialog();
    }

    deleteSkill(id: string) {
        this.jobSeekerSkillService.deleteMySkill(id).subscribe();
    }
}
