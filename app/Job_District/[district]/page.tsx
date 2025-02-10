'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './district.module.scss';
import { Job } from '../../../app/interface/Job';
import { formatSalary } from '../../Ultils/formatSalary';
import { CiLocationOn } from 'react-icons/ci';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import HotJob from '../../Ultils/HotJob/HotJob';
import { showToastError, showToastSuccess } from '../../Ultils/toast';

import District_Skeleton from './district_skeleton';
import ExperienceFilter from '../../skill_tag/[tech]/Context/ExperienceFilter';
import PositionFilter from '../../skill_tag/[tech]/Context/PositionFilter';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

const DistrictJob = () => {
    const params = useParams();
    const districtParam = params.district;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [experience, setExperience] = useState('Tất cả');
    const [position, setPosition] = useState('Tất cả');
    const [selectedSalary, setSelectedSalary] = useState('Thỏa thuận');

    const handleExperienceChange = (event: any) => {
        setExperience(event.target.value);
    };

    const handlePositionChange = (event: any) => {
        setPosition(event.target.value);
    };

    const handleSalaryChange = (value: any) => {
        setSelectedSalary(value);
    };

    useEffect(() => {
        const filterJobs = () => {
            let filtered = jobs;

            type ExperienceOptions =
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

            const experienceMap: Record<ExperienceOptions, string> = {
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

            if (experience !== 'Tất cả') {
                filtered = filtered.filter((job) => {
                    const mappedExperience = experienceMap[experience as ExperienceOptions];

                    if (mappedExperience === 'Above 10 years') {
                        return job.generalInformation.experience.includes('Above 10 years');
                    }

                    return job.generalInformation.experience === mappedExperience;
                });
            }

            // Lọc theo vị trí (jobLevel)
            if (position !== 'Tất cả') {
                filtered = filtered.filter((job) => {
                    // mảng chứa các cấp độ, kiểm tra nếu `postion` nằm trong mảng đó
                    return job.jobLevel.name.includes(position);
                });
            }

            setFilteredJobs(filtered);
            setDisplayedJobs(filtered);
        };

        filterJobs();
    }, [experience, jobs, position]);

    console.log('districtParam', districtParam);

    const fetchJobs = async () => {
        try {
            const response = await fetch(`${apiUrl}/jobs/all-jobsTypes`);
            const result = await response.json();

            if (result?.data && result.data.jobs) {
                // Lọc công việc dựa trên encode_arean
                const filteredJobs = result.data.jobs.filter(
                    (job: Job) => job.workLocation.district.encode_arean === districtParam
                );

                setJobs(filteredJobs);
                setDisplayedJobs(filteredJobs.slice(0, 15));
            } else {
                setError('Không tìm thấy dữ liệu công việc');
            }
        } catch (error) {
            setError('Lỗi khi tải dữ liệu công việc');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [districtParam]);

    const handleClearFilter = () => {
        setExperience('Tất cả');
        setPosition('Tất cả');
    };

    const activeFilters = [
        experience !== 'Tất cả' ? 'experience' : null,
        position !== 'Tất cả' ? 'position' : null,
    ].filter(Boolean).length;

    const renderNoJobsMessage = () => {
        if (experience !== 'Tất cả' && position !== 'Tất cả') {
            return <p>Không có công việc nào phù hợp với khu vực này.</p>;
        }

        if (experience !== 'Tất cả' && filteredJobs.length === 0) {
            return <p>Không có năm kinh nghiệm phù hợp với khu vực này.</p>;
        }

        if (position !== 'Tất cả' && filteredJobs.length === 0) {
            return <p>Không có vị trí phù hợp với khu vực này.</p>;
        }

        return null;
    };

    const handleSearch = () => {
        const filteredJobs = jobs.filter((job) =>
            job.generalInformation.tech_stack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (filteredJobs.length === 0) {
            showToastError('Không tìm thấy công việc phù hợp !');
        }
        setFilteredJobs(filteredJobs);
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredJobs(jobs); // Khi input rỗng, hiển thị lại toàn bộ jobs
        }
    }, [searchTerm]);

    return (
        <section className={styles.district_Job}>
            <div className={styles.district_Job__banner}>
                <div className={styles.banner_image}>
                    <img src="/images/Area/Area_2.jpg" alt="" />

                    <div className={styles.content}>
                        <h3>Chúng tôi cần tuyển dụng</h3>
                        <span>
                            Vị trí tại:{' '}
                            {districtParam
                                ? decodeURIComponent(Array.isArray(districtParam) ? districtParam[0] : districtParam)
                                : '...loading'}
                        </span>

                        <p>
                            Nhằm tìm kiếm nguồn nhân lực, phục vụ trong lĩnh vực Công nghệ thông tin tại các khu công
                            nghệ cao và doanh nghiệp phát triển phần mềm, nhiều công ty đang tích cực triển khai các
                            chương trình tuyển dụng, đào tạo và thu hút nhân tài thông qua các hội thảo nghề nghiệp, hợp
                            tác với các trường đại học và chính sách đãi ngộ hấp dẫn.
                        </p>
                        <a href="#job">Xem ngay</a>
                    </div>
                </div>
            </div>

            <div className={styles.wraper_header}>
                <div id="job" className={styles.total_amount__job}>
                    Công việc {filteredJobs.length}
                </div>
            </div>
            <div className={styles.wrapper_container}>
                <div className={styles.filtering_tool}>
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

                    <PositionFilter position={position} handlePositionChange={handlePositionChange} />

                    <div className={styles.salary_sort}>
                        <div className={styles.header_salary}>
                            <div>Lương</div>

                            <div className={styles.select_choose}>
                                <select name="" id="">
                                    <option value="">Thỏa thuận</option>
                                    <option value="">VNĐ</option>
                                    <option value="">USD</option>
                                    <option value="">Up to VND</option>
                                    <option value="">Up to USD</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.box_select}>
                            <span>Sắp xếp lương từ: </span>
                            <div className={styles.select_rank__sort}>
                                <select name="" id="">
                                    <option value="">Cao - Thấp </option>
                                    <option value="">Thấp - Cao </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.wrapper_jobList}>
                    <div className={styles.box_search}>
                        <div className={styles.box_input}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm gợi ý (Java, Javascript, .NET ...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button className={styles.btn_search} onClick={handleSearch}>
                            Tìm kiếm
                        </button>
                    </div>

                    <div className={styles.pagination}>
                        <button>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span>1 / 42</span>
                        <button>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                    <div className={styles.jobList}>
                        {loading ? (
                            District_Skeleton()
                        ) : error ? (
                            <p>{error}</p>
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div
                                    onClick={() => window.open(`/jobs/job_details/${job.jobId}`, '_blank')}
                                    key={job.jobId}
                                    className={styles.job}
                                >
                                    <HotJob isHot={job.Hot_Job !== 'Null'}>{job.Hot_Job}</HotJob>

                                    <span className={styles['icon-views']}>
                                        <FontAwesomeIcon icon={faEye} />
                                        {job.view}
                                    </span>

                                    <div className={styles.img_company}>
                                        <img src={job.company.images[0]?.image_company} alt="" />
                                    </div>

                                    <div className={styles.content_job}>
                                        <h3>{job.title}</h3>
                                        <span className={styles.company}>{job.company.name}</span>
                                        <span className={styles.salary} title={job.salary}>
                                            {job.salary_from === 0 && job.salary_to === 0 ? (
                                                <>Thỏa thuận</>
                                            ) : (
                                                <>{formatSalary(job.salary)}</>
                                            )}
                                        </span>
                                        <span className={styles.positon}>
                                            <p>{job.jobLevel.name.join(', ')}</p>
                                        </span>
                                        <span className={styles.district} title={job.workLocation.district.name}>
                                            <CiLocationOn />
                                            {job.workLocation.district.name}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            renderNoJobsMessage()
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DistrictJob;
