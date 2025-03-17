interface FavoriteJob {
    favoriteId: number;
    userId: number;
    jobId: number;
    saved_at: string;
    job: {
        jobId: number;
        title: string;
        salary_from: number;
        salary_to: number;
        expire_on: string;
        description: string;
        requirement: string;
        benefits: string;
        work_time: string;
        view: number;
        created_at: string;
        updated_at: string;
        workLocation: {
            workLocationId: number;
            address_name: string;
            district: {
                districtId: number;
                name: string;
            };
        };
        company: {
            companyId: number;
            name: string;
            image_company: string | null; // Có thể là null nếu không có ảnh
        };
        jobLevel: {
            jobLevelId: number;
            name: string;
        };
        jobType: {
            jobTypeId: number;
            name: string;
        };
        jobIndustry: {
            jobIndustryId: number;
            name: string;
        };
        generalInformation: {
            general_Information_Id: number;
            numberOfRecruits: number;
            gender: string;
        };
        refJob: {
            ref_job_Id: number;
            ref_url: string;
        };
    };
}