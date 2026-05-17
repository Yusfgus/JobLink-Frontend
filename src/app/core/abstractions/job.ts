import { JobSkill } from "./skill";


export enum ApplicationStatus {
    Pending = 'pending',
    Reviewing = 'reviewing',
    Interview = 'interview',
    Accepted = 'accepted',
    Rejected = 'rejected'
}

export interface Application {
    jobId: string;
    jobTitle: string;
    companyId: string;
    companyName: string;
    companyLogoUrl: string | null;
    country: string;
    city: string;
    status: ApplicationStatus;
    appliedAtUtc: Date;
}

export interface Job {
    id: string;
    title: string;
    jobType: string;
    locationType: string;
    companyId: string;
    companyName: string;
    companyLogoUrl: string | null;
    country: string;
    city: string;
    area: string;
    description: string;
    requirements: string;
    experienceLevel: string;
    skills: JobSkill[];
    minSalary: number | null;
    maxSalary: number | null;
    isApplied: boolean;
    isSaved: boolean;
    status: string;
    postedAtUtc: Date;
    savedAtUtc: Date | null;
    closedAt: Date | null;
    expirationDate: Date | null;
}



