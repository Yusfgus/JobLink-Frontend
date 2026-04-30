
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
    description: string;
    experienceLevel: string;
    skills: string[];
    postedAtUtc: Date;
    isApplied: boolean;
    isSaved: boolean;
    savedAtUtc: Date;
}

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

interface Skill {
    id: string;
    name: string;
    isRequired: boolean;
}

export interface JobDetails {
    id: string;
    title: string;
    jobType: string;
    locationType: string;
    companyName: string;
    companyLogoUrl: string | null;
    country: string;
    city: string;
    area: string;
    postedAtUtc: Date;
    closedAt: Date | null;
    expirationDate: Date;
    status: string;
    experienceLevel: string;
    minSalary: number | null;
    maxSalary: number | null;
    skills: Skill[];
    description: string;
    requirements: string;
}

