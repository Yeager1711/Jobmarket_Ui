'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import styles from './jobDetail.module.scss';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsDollar, faHourglassStart, faLocationDot, faIndustry } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
import { formatSalary } from '../../../Ultils/formatSalary';
import JobDetails_Skeleton from './jobDetail__Skeleton';
import HotJob from 'app/Ultils/HotJob/HotJob';

interface Job {
    success: boolean;
    data: {
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
        created_at: string;
        updated_at: string;
        Hot_Job: string;
        workLocation: {
            workLocationId: number;
            address_name: string;
            created_at: string;
            updated_at: string;
            district: {
                districtId: number;
                name: string;
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
    };
}

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function JobDetail() {
    const router = useRouter();
    const [jobDetails, setJobDetails] = useState<Job['data'] | null>(null);
    const [jobData, setJobData] = useState<Record<string, Job['data'][]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleRedirect = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        e.preventDefault();
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const params = useParams();
    const jobId = params.id;

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                // Gọi API
                const response = await fetch(`${apiUrl}/jobs/${jobId}`);
                const { data } = await response.json();

                setJobDetails(data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };
        fetchJobDetails();
    }, [jobId]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch job details to get the current company
                const currentJobResponse = await fetch(`${apiUrl}/jobs/${jobId}`);
                const currentJobData = await currentJobResponse.json();

                if (!currentJobData.success) {
                    setError('Không tìm thấy thông tin công việc');
                    return;
                }

                const currentCompanyName = currentJobData.data.company.name;
                const currentJobsLevel = currentJobData.data.jobLevel.name;

                // Fetch all jobs
                const response = await fetch(`${apiUrl}/jobs/all-jobs`);
                const allJobsData = await response.json();

                if (allJobsData.success) {
                    // Lọc công việc cùng công ty
                    const filteredJobs = allJobsData.data.filter(
                        (job: Job['data']) => job.company.name === currentCompanyName
                    );

                    const filteredJobsLevel = allJobsData.data.filter(
                        (job: Job['data']) => job.jobLevel.name === currentJobsLevel
                    );

                    // Nhóm công việc theo công ty
                    const groupedJobs = filteredJobs.reduce((acc: any, job: any) => {
                        const companyName = job.company.name;
                        if (!acc[companyName]) {
                            acc[companyName] = [];
                        }
                        acc[companyName].push(job);
                        return acc;
                    }, {});

                    // nhóm các công ty đang tuyển cùng 1 vị trí
                    const groupedJobLevel = filteredJobsLevel.reduce((acc: any, level: any) => {
                        const jobLevel = level.jobLevel.name;
                        if (!acc[jobLevel]) {
                            acc[jobLevel] = [];
                        }
                        acc[jobLevel].push(level);
                        return acc;
                    }, {});

                    setJobData({ ...groupedJobs, ...groupedJobLevel });
                } else {
                    setError('Không tìm thấy dữ liệu công việc');
                }
            } catch (err) {
                setError('Có lỗi xảy ra khi lấy dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [jobId]);

    if (!jobDetails) {
        return (
            <section className={styles.jobDetail + ' marTop'}>
                <JobDetails_Skeleton />
            </section>
        );
    }

    return (
        <section className={styles.jobDetail + ' marTop'}>
            <div className={styles.company}>
                <div className={styles.image_company}>
                    <img
                        src={jobDetails.company.images[0]?.image_company || 'default-image.png'}
                        alt={jobDetails.company.name}
                    />
                </div>
                <div className={styles.name_company}>
                    {jobDetails.company.name}

                    <span className={styles.basic_infomation_item__industry}>
                        <FontAwesomeIcon icon={faIndustry} />
                        Lĩnh vực:
                        <p>{jobDetails.jobIndustry.name}</p>
                    </span>
                    <span className={styles.basic_infomation_item}>
                        <FontAwesomeIcon icon={faLocationDot} />
                        <p>{jobDetails.workLocation.address_name}</p>
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                <div className={styles.infomation}>
                    <div className={styles.wrapper_infomation}>
                        <div className={styles.basic_infomation}>
                            {jobDetails.Hot_Job && jobDetails.Hot_Job !== 'Null' && (
                                <div className={styles.Remarkable}>
                                    <span className={styles.on1}></span>
                                    <p>{jobDetails.Hot_Job}</p>
                                    <span className={styles.on2}></span>
                                </div>
                            )}

                            <h4 className={styles.infomation_Content_Title_job}>{jobDetails.title}</h4>
                            <div className={styles.infomation_Content_section}>
                                <span className={styles.basic_infomation_item}>
                                    <FontAwesomeIcon icon={faCommentsDollar} />
                                    Mức lương:
                                    <p>
                                        {jobDetails.salary_from === 0 && jobDetails.salary_to === 0 ? (
                                            <>Thỏa thuận</>
                                        ) : (
                                            <> {formatSalary(jobDetails.salary)}</>
                                        )}
                                    </p>
                                </span>
                                <span className={styles.basic_infomation_item}>
                                    <FontAwesomeIcon icon={faHourglassStart} />
                                    Kinh nghiệm:
                                    <p> {jobDetails.generalInformation.experience}</p>
                                </span>
                            </div>
                            <Link
                                href="#"
                                className={styles.box_apply_current}
                                onClick={(e) => handleRedirect(e, jobDetails.refJob.ref_url)}
                            >
                                Ứng tuyển ngay
                            </Link>
                        </div>

                        <div className={styles.basic_infomation_description}>
                            <h3>Mô tả công việc</h3>
                            <span>
                                {jobDetails.description
                                    .split(/\n|•/)
                                    .filter((line) => line.trim())
                                    .map(
                                        (item, index) =>
                                            item && (
                                                <p key={index} style={{ marginBottom: '1rem' }}>
                                                    {item}
                                                </p>
                                            )
                                    )}
                            </span>
                        </div>

                        <div className={styles.basic_infomation_requesment}>
                            <h3>Yêu cầu ứng viên</h3>
                            <span>
                                {jobDetails.requirement
                                    .split(/\n|•/)
                                    .filter((line) => line.trim())
                                    .map((item, index) => (
                                        // <p key={index} style={{ marginBottom: '1rem', textIndent: '1rem' }}>
                                        <p key={index} style={{ marginBottom: '1rem' }}>
                                            {item.trim()}
                                        </p>
                                    ))}
                            </span>
                        </div>

                        <div className={styles.basic_infomation_benifet}>
                            <h3>Phúc lợi</h3>
                            <span>
                                {jobDetails.benefits.split(/\n|•/).map(
                                    (item, index) =>
                                        item.trim() && (
                                            <p key={index} style={{ marginBottom: '1rem' }}>
                                                - {item.trim()}
                                            </p>
                                        )
                                )}
                            </span>

                            <span>
                                {jobDetails.benefits
                                    .split(/\n|•/)
                                    .filter((line) => line.trim())
                                    .map(
                                        (item, index) =>
                                            item && (
                                                <p key={index} style={{ marginBottom: '1rem' }}>
                                                    {item}
                                                </p>
                                            )
                                    )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.wraper__generalInformation}>
                    <div className={styles.generalInformation}>
                        <h3>Thông tin chung</h3>

                        <React.Fragment>
                            <span className={styles.generalInformation_item}>
                                Kinh nghiệm tối thiếu: <p>{jobDetails.generalInformation.experience}</p>
                            </span>

                            <span className={styles.generalInformation_item}>
                                Cấp bậc: <p>{jobDetails.jobLevel.name.join(', ')}</p>
                            </span>

                            <span className={styles.generalInformation_item}>
                                Số lượng tuyển:{' '}
                                {jobDetails?.generalInformation?.numberOfRecruits ? (
                                    <p>{jobDetails.generalInformation.numberOfRecruits}</p>
                                ) : (
                                    <p>Không đề cập</p>
                                )}
                            </span>

                            <span className={styles.generalInformation_item}>
                                Loại hợp đồng: <p>{jobDetails.jobType.name}</p>
                            </span>

                            <span className={styles.generalInformation_item}>
                                Hình thức làm việc: <p>{jobDetails.jobType.work_at.join(' , ')}</p>
                            </span>
                            <span className={styles.generalInformation_item}>
                                Giới tính:{' '}
                                <p>
                                    {jobDetails.generalInformation.gender === 'no pairing'
                                        ? 'Không đề cập'
                                        : jobDetails.generalInformation.gender}
                                </p>
                            </span>

                            <span className={styles.generalInformation_itemTech_Stack}>
                                <p> Công nghệ sử dụng:</p>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {jobDetails.generalInformation.tech_stack.map((tech, index) => (
                                        <p
                                            onClick={() => router.push(`/skill_tag/${tech}`)}
                                            key={index}
                                            className={styles.tech__stack}
                                        >
                                            {tech}
                                        </p>
                                    ))}
                                </div>
                            </span>
                        </React.Fragment>
                    </div>

                    <div className={styles.jobSame__company}>
                        <h3>
                            <p>{jobDetails.company.name}</p> Vị trí đang tuyển
                        </h3>
                        {Object.entries(jobData).map(([companyName, jobs]) => (
                            <div key={companyName} className={styles.companyJobs}>
                                {jobs.map((job, index) => (
                                    <div
                                        onClick={() => router.push(`/jobs/job_details/${job.jobId}`)}
                                        key={job.jobId}
                                        className={styles.box_companyJob}
                                    >
                                        <HotJob isHot={job.Hot_Job === 'HOT JOB'} />
                                        <div className={styles.logo__company}>
                                            <img
                                                src={job.company.images[0]?.image_company || 'default-image.png'}
                                                alt={job.company.name}
                                                className={styles.jobImage}
                                            />
                                        </div>

                                        <div className={styles.jobInfo}>
                                            <h2 title={job.title}>{job.title}</h2>
                                            <p
                                                className={styles.job__experience}
                                                title={job.generalInformation.experience}
                                            >
                                                {job.jobLevel.name.join(' , ')} - {job.generalInformation.experience}
                                            </p>
                                            <p className={styles.company__salary}>
                                                {job.salary_from === 0 && job.salary_to === 0 ? (
                                                    <>Thỏa thuận</>
                                                ) : (
                                                    <> {formatSalary(job.salary)}</>
                                                )}
                                            </p>
                                            <p className={styles.company__location}>{job.workLocation.district.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default JobDetail;
