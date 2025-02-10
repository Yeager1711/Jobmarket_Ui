'use client';
import React, { useState, useEffect } from 'react';
import styles from './jobTag.module.scss';
import classNames from 'classnames';
import { useRouter, useParams } from 'next/navigation';
import { formatSalary } from 'app/Ultils/formatSalary';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import TechStack__Skeleton from './tech_skeleton';
import { Job } from '../../interface/Job';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHeart, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import ExperienceFilter from './Context/ExperienceFilter';
import SalaryFilter from './Context/SalaryFilter';
import PositionFilter from './Context/PositionFilter';
import JobTypeFilter from './Context/JobTypeFilter';

import HotJob from 'app/Ultils/HotJob/HotJob';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function skillTag() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    // State cho các bộ lọc
    const [experience, setExperience] = useState('Tất cả');
    const [salary, setSalary] = useState('Tất cả');
    const [position, setPosition] = useState('Tất cả');
    const [jobType, setJobType] = useState('Tất cả');

    const [currency, setCurrency] = useState('VNĐ');
    const [salaryFrom, setSalaryFrom] = useState('');
    const [salaryTo, setSalaryTo] = useState('');
    const [isCustomSalaryRange, setIsCustomSalaryRange] = useState(false);

    const [loading, setLoading] = useState(true); // Added loading state
    const router = useRouter();
    const params = useParams();
    const tech = params.tech;

    // Format number with commas
    const formatNumber = (value: string) => {
        // Remove non-numeric characters
        const number = value.replace(/[^\d]/g, '');
        // Format with commas
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`${apiUrl}/jobs/by-tech/${tech}`);
                const { data } = await response.json();
                setJobs(data);
                setFilteredJobs(data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false); // Stop loading once the data is fetched
            }
        };
        fetchJobDetails();
    }, [tech]);

    // Lọc danh sách công việc
    useEffect(() => {
        const filterJobs = () => {
            let filtered = jobs;

            // Define a union type for the experience options
            type ExperienceOption =
                | 'Tất cả'
                | 'Không yêu cầu'
                | 'Dưới 1 năm'
                | '1 năm'
                | '2 năm'
                | '3 năm'
                | '4 năm'
                | '5 năm'
                | '6 năm'
                | '7 năm'
                | '8 năm'
                | '9 năm'
                | '10 năm'
                | 'Trên 10 năm';

            // Map UI experience values to API experience format
            const experienceMap: Record<ExperienceOption, string> = {
                'Tất cả': 'Tất cả',
                'Không yêu cầu': 'Not required',
                'Dưới 1 năm': 'From 06 months',
                '1 năm': 'From 1 year',
                '2 năm': 'From 2 years',
                '3 năm': 'From 3 years',
                '4 năm': 'From 4 years',
                '5 năm': 'From 5 years',
                '6 năm': 'From 6 years',
                '7 năm': 'From 7 years',
                '8 năm': 'From 8 years',
                '9 năm': 'From 9 years',
                '10 năm': 'From 10 years',
                'Trên 10 năm': 'Above 10 years',
            };

            // Lọc theo kinh nghiệm
            // Lọc theo kinh nghiệm
            if (experience !== 'Tất cả') {
                filtered = filtered.filter((job) => {
                    // Map the selected experience value to API format
                    const mappedExperience = experienceMap[experience as ExperienceOption];

                    // If the experience is "Trên 10 năm", handle it separately
                    if (mappedExperience === 'Above 10 year') {
                        // Check if the job's experience is greater than 10 years
                        return job.generalInformation.experience.includes('Above 10 year');
                    }

                    // Match the experience value from the API for other cases
                    return job.generalInformation.experience === mappedExperience;
                });
            }

            // Lọc theo mức lương
            if (salary === 'Tất cả') {
                // Hiển thị tất cả jobs, kể cả "Thỏa thuận"
                filtered = filtered.filter((job) => {
                    const salaryFrom = job.salary_from ?? 0;
                    const salaryTo = job.salary_to ?? 0;
                    return salaryFrom >= 0 && salaryTo >= 0; // Bao gồm cả lương từ/thỏa thuận
                });
            } else if (salary === 'Thỏa thuận') {
                filtered = filtered.filter((job) => {
                    const salaryFrom = job.salary_from ?? 0;
                    const salaryTo = job.salary_to ?? 0;
                    return salaryFrom === 0 && salaryTo === 0;
                });
            } else {
                // Lọc theo khoảng lương
                filtered = filtered.filter((job) => {
                    const salaryFrom = job.salary_from ?? 0;
                    const salaryTo = job.salary_to ?? 0;

                    if (salary === 'Dưới 10tr') return salaryTo <= 10000000;
                    if (salary === '10 - 20tr') return salaryFrom < 20000000 && salaryTo > 10000000;
                    if (salary === '20 - 30tr') return salaryFrom < 30000000 && salaryTo > 20000000;
                    if (salary === '30 - 40tr') return salaryFrom < 40000000 && salaryTo > 30000000;
                    if (salary === 'Trên 40tr') return salaryFrom > 40000000 || salaryTo > 40000000;

                    return false;
                });
            }

            // Lọc theo vị trí (jobLevel)
            if (position !== 'Tất cả') {
                filtered = filtered.filter((job) => {
                    // mảng chứa các cấp độ, kiểm tra nếu `postion` nằm trong mảng đó
                    return job.jobLevel.name.includes(position);
                });
            }

            const jobTypeMapping: Record<string, string> = {
                Fulltime: 'Fulltime',
                'Từ xa': 'Remote',
                'Tại công ty': 'In Office',
                Hybrid: 'Hybrid',
            };

            if (jobType !== 'Tất cả') {
                filtered = filtered.filter((job) => {
                    // Kiểm tra nếu name là mảng và chứa giá trị mong muốn
                    return Array.isArray(job.jobType.work_at) && job.jobType.work_at.includes(jobTypeMapping[jobType]);
                });
            }

            setFilteredJobs(filtered);
        };

        filterJobs();
    }, [experience, salary, position, jobs, jobType]);

    const handleExperienceChange = (event: any) => {
        setExperience(event.target.value);
    };

    // Modify handleSalaryChange
    const handleSalaryChange = (event: any) => {
        setSalary(event.target.value);
        // Clear custom salary range when using radio buttons
        setSalaryFrom('');
        setSalaryTo('');
        setIsCustomSalaryRange(false);
    };

    const handlePositionChange = (event: any) => {
        setPosition(event.target.value);
    };

    const handleJobType = (event: any) => {
        setJobType(event.target.value);
    };

    const handleClearFilter = () => {
        setExperience('Tất cả');
        setSalary('Tất cả');
        setPosition('Tất cả');
        setJobType('Tất cả');
        setSalaryFrom('');
        setSalaryTo('');
        setIsCustomSalaryRange(false);
    };

    // Bỏ việc xóa checked trong handleSalaryFromChange và handleSalaryToChange
    const handleSalaryFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatNumber(e.target.value);
        setSalaryFrom(formattedValue);
    };

    const handleSalaryToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatNumber(e.target.value);
        setSalaryTo(formattedValue);
    };

    // Thêm việc xóa checked vào handleApplySalary
    const handleApplySalary = () => {
        const fromValue = parseFormattedNumber(salaryFrom);
        const toValue = parseFormattedNumber(salaryTo);

        if (salaryFrom || salaryTo) {
            setSalary(''); // Xóa checked của radio button
        }

        // Kiểm tra nếu fromValue và toValue hợp lệ
        if (toValue >= fromValue) {
            const filtered = jobs.filter((job) => {
                const jobSalaryFrom = job.salary_from ?? 0;
                const jobSalaryTo = job.salary_to ?? 0;

                return jobSalaryFrom <= toValue && jobSalaryTo >= fromValue;
            });

            console.log('Filtered Jobs:', filtered);

            // Đảm bảo cập nhật state trong một callback
            setFilteredJobs((prev) => {
                console.log('Setting new filtered jobs:', filtered);
                return filtered;
            });
        } else {
            // Thông báo nếu khoảng lương không hợp lệ
            alert('Vui lòng nhập khoảng lương hợp lệ');
            return;
        }
    };

    // Handle currency change
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value);
        // Reset salary inputs when currency changes
        setSalaryFrom('');
        setSalaryTo('');
    };

    // Convert string with commas to number
    const parseFormattedNumber = (formattedValue: string) => {
        return Number(formattedValue.replace(/,/g, '').trim()) || 0;
    };

    const activeFilters = [experience, isCustomSalaryRange ? 'custom' : salary, position, jobType].filter(
        (filter) => filter !== 'Tất cả'
    ).length;

    return (
        <section className={styles.jobTag + ' marTop'}>
            <div className={styles.wrapper__jobTag}>
                <div className={styles.wrapper_jobs}>
                    <h2>
                        {loading ? <Skeleton width={50} /> : `${filteredJobs.length} Công việc`}
                        {loading ? (
                            <Skeleton width={50} height={30} />
                        ) : (
                            <span className={styles.tag}>
                                {typeof tech === 'string'
                                    ? decodeURIComponent(tech)
                                    : tech?.[0]
                                      ? decodeURIComponent(tech[0])
                                      : ''}
                            </span>
                        )}
                    </h2>

                    <div className={styles.wrapper_container}>
                        <div className={styles.Find_advanced__jobs}>
                            <div className={styles.header_advanced__jobs}>
                                <h3>Bộ lọc nâng cao</h3>
                                <button
                                    className={styles.btn_clear__filter}
                                    onClick={() => handleClearFilter()}
                                    disabled={activeFilters === 0}
                                >
                                    Xóa lọc {activeFilters > 0 && `(${activeFilters})`}
                                </button>
                            </div>

                            <ExperienceFilter experience={experience} handleExperienceChange={handleExperienceChange} />
                            <SalaryFilter
                                salary={salary}
                                currency={currency}
                                salaryFrom={salaryFrom}
                                salaryTo={salaryTo}
                                handleSalaryChange={handleSalaryChange}
                                handleCurrencyChange={handleCurrencyChange}
                                handleSalaryFromChange={handleSalaryFromChange}
                                handleSalaryToChange={handleSalaryToChange}
                                handleApplySalary={handleApplySalary}
                            />
                            <PositionFilter position={position} handlePositionChange={handlePositionChange} />
                            <JobTypeFilter jobType={jobType} handleJobType={handleJobType} />

                            <div className={styles.banner}>
                                <img src="/images/banner_tech.jpg" alt="" />

                                <div className={styles.tech_position}>
                                    <span className={styles.tag}>
                                        #
                                        {typeof tech === 'string'
                                            ? decodeURIComponent(tech)
                                            : tech?.[0]
                                              ? decodeURIComponent(tech[0])
                                              : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.wrapper_jobsContainer}>
                            {loading ? (
                                <TechStack__Skeleton />
                            ) : filteredJobs && filteredJobs.length > 0 ? (
                                filteredJobs
                                .sort((a,b) => Number(b.Hot_Job !== 'Null') - Number(a.Hot_Job !== 'Null'))
                                .map((job) => (
                                    <div className={styles.box_jobs} key={job.jobId}>
                                        <div className={styles.views_total}>
                                            <FontAwesomeIcon icon={faEye} /> {job.view}
                                        </div>
                                        
                                        <HotJob isHot={job.Hot_Job !== 'Null'}> {job.Hot_Job}</HotJob>
                                        <div className={styles.btn_favorite__job}>
                                            <FontAwesomeIcon icon={faHeart} />
                                        </div>
                                        <div className={styles.image_company}>
                                            <img
                                                onClick={() => window.open(`/jobs/job_details/${job.jobId}`, '_blank')}
                                                src={job.company.images[0]?.image_company || '/placeholder.jpg'}
                                                alt={job.company.name}
                                            />
                                        </div>
                                        <div className={styles.content}>
                                            <h3 onClick={() => window.open(`/jobs/job_details/${job.jobId}`, '_blank')}>
                                                {job.title}
                                            </h3>
                                            <span className={styles.company__name} title={job.company.name}>
                                                {job.company.name}
                                            </span>
                                            <span className={styles.job_level}>
                                                <p onClick={() => window.open(`/jobs/job_details/${job.jobId}`, '_blank')}>
                                                    {job.jobLevel.name.join(' , ')}
                                                </p>
                                                <svg
                                                    stroke="currentColor"
                                                    fill="currentColor"
                                                    strokeWidth="0"
                                                    viewBox="0 0 256 256"
                                                    height="1em"
                                                    width="1em"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z"></path>
                                                </svg>
                                                <p>
                                                    {job.salary === 'Negotiable'
                                                        ? 'Thỏa thuận'
                                                        : formatSalary(job.salary)}
                                                </p>
                                            </span>
                                            <div className={styles.tag__job}>
                                                {job.generalInformation.tech_stack.map((tech, index) => (
                                                    <p
                                                        onClick={() => router.push(`/skill_tag/${tech}`)}
                                                        key={index}
                                                        className={styles.tech__stack}
                                                    >
                                                        {tech}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default skillTag;
