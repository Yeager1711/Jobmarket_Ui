// BannerSearch.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CiLocationOn } from 'react-icons/ci';
import styles from './BannerSearch.module.scss';
import { Job } from 'app/interface/Job';
import { formatSalary } from '../../../Ultils/formatSalary';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import { PiDiamondsFour } from 'react-icons/pi';

import HotJob from 'app/Ultils/HotJob/HotJob';

import BannerSearch_Skeleton from './BannerSearch_skeleton';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

const BannerSearch = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [allJobData, setAllJobData] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const animationInterval = 10000;
    const [currentJobIndex, setCurrentJobIndex] = useState(0);

    const toggleVisible = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const response = await fetch(`${apiUrl}/jobs/all-jobs`);
                const data: { data: Job[]; totalItems: number } = await response.json();

                const sortedData = data.data.sort(
                    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
                setAllJobData(sortedData);
                setLoading(false);
            } catch (err) {
                setError('Có lỗi xảy ra khi lấy dữ liệu');
                setLoading(false);
            }
        };

        fetchAllJobs();
    }, []);

    const handleSearch = () => {
        // Kiểm tra nếu không nhập gì và không chọn địa điểm
        if (!searchTerm.trim() && !selectedLocation) {
            setFilteredJobs([]);
            setIsExpanded(false);
            return;
        }

        let results = allJobData;

        // Lọc theo từ khóa nếu có
        if (searchTerm.trim()) {
            results = results.filter((job) => {
                const titleMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
                const jobLevelMatch = job.jobLevel.name.some((level) =>
                    level.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const techStackMatch = job.generalInformation.tech_stack.some((tech) =>
                    tech.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const jobTypeWorkAtMatch = job.jobType.work_at.some((workAt) =>
                    workAt.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const jobTypeNameMatch = job.jobType.name.some((name) =>
                    name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const companyNameMatch = job.company.name.toLowerCase().includes(searchTerm.toLowerCase());

                return (
                    titleMatch ||
                    jobLevelMatch ||
                    techStackMatch ||
                    jobTypeWorkAtMatch ||
                    jobTypeNameMatch ||
                    companyNameMatch
                );
            });
        }

        // Lọc theo địa điểm nếu có
        if (selectedLocation) {
            results = results.filter((job) =>
                // Kiểm tra xem tên địa phương có chứa địa điểm đã chọn hay không
                job.workLocation.district.name.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        results.sort((a, b) => {
            if(a.Hot_Job !== 'Null' || b.Hot_Job === 'Null') {
                return -1;
            }else  if(a.Hot_Job === 'Null' || b.Hot_Job !== 'Null') {
                return 1
            }

            return 0
        })

        setFilteredJobs(results);
        setIsExpanded(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocation(e.target.value);
    };

    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const jobsToday = allJobData.filter((job) => {
        const jobDate = new Date(job.created_at);
        return (
            jobDate.getDate() === today.getDate() &&
            jobDate.getMonth() === today.getMonth() &&
            jobDate.getFullYear() === today.getFullYear()
        );
    });

    // Animation logic
    useEffect(() => {
        if (jobsToday.length === 0) return;

        const interval = setInterval(() => {
            setCurrentJobIndex((prevIndex) => (prevIndex + 5) % allJobData.length);
        }, animationInterval);

        return () => clearInterval(interval);
    }, [jobsToday]);

    const visibleJobs = allJobData.slice(currentJobIndex, currentJobIndex + 5);

    return (
        <section className={styles['banner-image']}>
            <div className={styles['wrapper-content']}>
                <div className={styles['search-infoWork']}>
                    <div className={styles['content']}>
                        <div className={styles.box__content}>
                            <h3>Công việc mới hôm nay </h3>
                            <div className={styles.jobs_new}>
                                {loading ? (
                                    <BannerSearch_Skeleton />
                                ) : visibleJobs.length > 0 ? (
                                    visibleJobs.map((job) => (
                                        <Link
                                            href={`/jobs/job_details/${job.jobId}`}
                                            key={job.jobId}
                                            className={styles['job-item']}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {job.Hot_Job && job.Hot_Job !== 'Null' && (
                                                <div className={styles.Remarkable}>
                                                    {' '}
                                                    <PiDiamondsFour />
                                                    {job.Hot_Job}
                                                </div>
                                            )}

                                            <div className={styles['image-company']}>
                                                <img
                                                    src={job.company.images[0]?.image_company}
                                                    alt={job.company.name}
                                                />
                                            </div>

                                            <div style={{ flex: '1 1' }}>
                                                <div className={styles['job-title']} title={job.title}>
                                                    <span>{job.title}</span>
                                                </div>
                                                <div className={styles['job-location']}>
                                                    <span>{job.workLocation.district.name}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className={styles['no-jobs']}>Không có công việc mới hôm nay</div>
                                )}
                            </div>
                        </div>

                        <div className={styles.box__content_data}>
                            <div className={styles.box__content_title}>
                                <Swiper pagination={true} modules={[Pagination]} className="mySwiperBannerSlides">
                                    <SwiperSlide>
                                        <div className={styles.images_slide}>
                                            <img src="./slides/slide4.jpg" alt="" />
                                        </div>
                                    </SwiperSlide>

                                    <SwiperSlide>
                                        <div className={styles.images_slide}>
                                            <img src="./slides/slide2.jpg" alt="" />
                                        </div>
                                    </SwiperSlide>

                                    <SwiperSlide>
                                        <div className={styles.images_slide}>
                                            <img src="./slides/slide3.jpg" alt="" />
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>

                            <div className={styles.box__content_today}>
                                <div className={styles.current_today}>
                                    <h3>
                                        Thị trường tìm việc hôm nay:{' '}
                                        <span>
                                            <p>{formattedDate}</p>
                                        </span>{' '}
                                    </h3>
                                </div>

                                <div className={styles.current_today_data}>
                                    <span>
                                        Việc làm đang tuyển dụng: <p>{allJobData.length}</p>
                                    </span>
                                    <span>
                                        Số lượng công ty đang tuyển dụng: <p>122</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles['find-work']} ${isExpanded ? styles['expand'] : ''}`}>
                        <div className={styles['flex-search']}>
                            <div className={styles['box-input']}>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm các ngành nghề..."
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                    className={styles['search-input']}
                                />
                            </div>
                            <div className={styles['box-select']}>
                                <select onChange={handleLocationChange} className={styles['select-input']}>
                                    <option value="">Chọn địa điểm</option>
                                    <option value="Hồ Chí Minh">TP.Hồ Chí Minh</option>
                                    <option value="Hà Nội">Hà Nội</option>
                                    <option value="Đà Nẵng">TP.Đà Nẵng</option>
                                    <option value="Hải Phòng">TP.Hải Phòng</option>
                                    <option value="Cần Thơ">TP.Cần Thơ</option>
                                    <option value="Huế">TP.Huế</option>
                                    <option value="Nha Trang">TP.Nha Trang</option>
                                    <option value="Vũng Tàu">TP.Vũng Tàu</option>
                                    <option value="Buôn Ma Thuột">TP.Buôn Ma Thuột</option>
                                    <option value="Quy Nhơn">TP.Quy Nhơn</option>
                                </select>
                            </div>
                            <div
                                className={styles['btn-find']}
                                onClick={() => {
                                    handleSearch();
                                    toggleVisible();
                                }}
                            >
                                Tìm việc
                            </div>
                        </div>

                        <div className={`${styles['search-result__container']} ${isVisible ? styles['visible'] : ''}`}>
                            {isExpanded && filteredJobs.length > 0 && (
                                <span className={styles['search-result__total']}>
                                    Kết quả tìm kiếm: {filteredJobs.length}
                                </span>
                            )}

                            <div className={styles.search_result__container__wrapper}>
                                {isExpanded && filteredJobs.length > 0 ? (
                                    filteredJobs.map((job) => (
                                        <Link
                                            href={`/jobs/job_details/${job.jobId}`}
                                            key={job.jobId}
                                            className={styles['search-result-item']}
                                        >
                                            <HotJob isHot={job.Hot_Job !== 'Null'}> {job.Hot_Job}</HotJob>
                                            <div className={styles['image-company__result']}>
                                                <img
                                                    src={job.company.images[0]?.image_company}
                                                    alt={job.company.name}
                                                />
                                            </div>
                                            <div className={styles['name-company__result']} title={job.title}>
                                                <span>{job.title}</span>
                                            </div>
                                            <div className={styles['location__result']}>
                                                <span>
                                                    <CiLocationOn /> {job.workLocation.district.name}
                                                </span>
                                            </div>
                                            <div className={styles['salary__result']}>
                                                <span>
                                                    {job.salary_from === 0 || job.salary_to === 0 ? (
                                                        <>Thỏa thuận</>
                                                    ) : (
                                                        <>{formatSalary(job.salary)}</>
                                                    )}
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                ) : isExpanded ? (
                                    <div className={styles['no-result']}>Không tìm thấy công việc phù hợp !</div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerSearch;
