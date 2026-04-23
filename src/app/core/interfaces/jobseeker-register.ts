export interface JobseekerRegister {
	email: string;
	password: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	gender: "Male" | "Female";
}



