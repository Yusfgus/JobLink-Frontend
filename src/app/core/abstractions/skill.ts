
export interface Skill {
    id: string;
    name: string;
}

export enum SkillLevel {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced",
    Expert = "Expert"
}

export interface JobSeekerSkill {
    id: string;
    skillId: string;
    skillName: string;
    skillLevel: SkillLevel;
}

export interface JobSkill {
    id: string;
    skillId: string;
    skillName: string;
    isRequired: boolean;
}