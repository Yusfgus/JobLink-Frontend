
export interface JobCard {
    id: string;
    title: string;
    jobType: string;
    locationType: string;
    companyId: string;
    companyName: string;
    companyLogoUrl: string;
    country: string;
    city: string;
    description: string;
    experienceLevel: string;
    skills: string[];
    postedAtUtc: Date;
    isApplied: boolean;
}

export interface JobSummary extends JobCard {
    isSaved: boolean;
}

export interface SavedJob extends JobCard {
    savedAtUtc: Date;
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

