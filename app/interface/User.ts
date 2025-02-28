export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    image?: string;
    resume?: string;
    gender:string;
    dateOfBirth: string;
    nationality :string;
    highestDegree:string;
    jobTitle?: string;
    industry?: string;
    experienceLevel?: string;
    skills?: string;
    education?: string;
    isJobSeeker: boolean;
    isProfileVisible: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
    status: string;
    profileCompletion: number
}
