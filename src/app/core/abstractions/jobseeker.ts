export enum Gender {
	Male = "Male",
	Female = "Female"
}

export enum MilitaryStatus {
	Nationality = "Nationality",
	Exempted = "Exempted",
	Completed = "Completed",
	Postponed = "Postponed"
}

export enum MaritalStatus {
	Single = "Single",
	Married = "Married",
	Divorced = "Divorced",
	Widow = "Widow",
	Separated = "Separated"
}

export interface JobseekerRegister {
	email: string;
	password: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	gender: Gender;
}

export interface JobSeekerProfile {
	id: string;
	firstName: string;
	middleName: string;
	lastName: string;
	mobileNumber?: string;
	birthDate?: Date;
	gender: Gender;
	nationality?: string;
	militaryStatus?: MilitaryStatus;
	maritalStatus?: MaritalStatus;
	country?: string;
	city?: string;
	area?: string;
	profilePictureUrl?: string;
	summary?: string;
}

export interface JobSeekerResume {
	id: string;
	resumeUrl: string;
}