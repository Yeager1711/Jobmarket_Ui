export interface Job {
    success: boolean;
    jobId: number;
    title: string;
    salary: string;
    salary_from: number;
    salary_to: number;
    expire_on: string;
    description: string;
    requirement: string;
    benefits: string;
    work_time: string;
    view:number;
    Hot_Job:string;
    created_at: string;
    updated_at: string;
    workLocation: {
        workLocationId: number;
        address_name: string;
        created_at: Date;
        updated_at: Date;
        district: {
            districtId: number;
            name: string;
            encode_arean: string;
        };
    };
    company: {
        companyId: number;
        name: string;
        created_at: string;
        updated_at: string;
        images: {
            ImageCompanyId: number;
            image_company: string;
        }[];
    };
    refJob: {
        ref_job_Id: number;
        ref_url: string;
        created_at: string;
        updated_at: string;
    };
    jobType: {
        jobTypeId: number;
        work_at: string[];
        name: string[];
    };
    jobLevel: {
        jobLevelId: number;
        name: string[];
    };
    jobIndustry: {
        jobIndustryId: number;
        name: string;
    };
    generalInformation: {
        general_Information_Id: number;
        numberOfRecruits: number;
        gender: string;
        experience: string;
        tech_stack: string[];
    };
}
