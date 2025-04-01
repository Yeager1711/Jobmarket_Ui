'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import styles from './styles/home.module.scss';
import 'aos/dist/aos.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CiLocationOn } from 'react-icons/ci';

import Regional_Recruitment from './pages/Home/Regional_Recruitment/Regional_Recruitment';
import ChartSection from './pages/Home/ChartSection/page';
import SearchTypes from './pages/Home/SearchTypes/page';
import OutstandingTool from './pages/Home/OutstandingTool/page';
import OutstandingCompany from './pages/Home/OutstandingCompany/page';
import BannerSearch from './pages/Home/BannerSearch/page';
import NotificationCard from './pages/DefaultLayouts/Notifications/receive/NotificationCard/NotificationCard';

import { formatSalary } from './Ultils/formatSalary';
import Home_Skeleton from './home_skeleton';
import { Job } from '../app/interface/Job';
import HotJob from './Ultils/HotJob/HotJob';
import { useHandleViewJob } from './Ultils/hanle__viewJob';
import { useApi } from './Context/ApiContext/ApiContext'; // Điều chỉnh đường dẫn

function Home() {
    const router = useRouter();
    const handleViewJob = useHandleViewJob();
    const { fetchJobsBySkip, fetchAllJobs } = useApi(); // Sử dụng useApi

    const [jobs, setJobs] = useState<Job[]>([]);
    const [allJobData, setAllJobData] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [totalItems, setTotalItems] = useState(0);
    const [totalItems_Type, setTotalItems_Type] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 12;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        const loadJobsBySkip = async () => {
            try {
                const skip = (currentPage - 1) * itemsPerPage;
                const take = itemsPerPage;
                const data = await fetchJobsBySkip(skip, take); // Gọi từ context
                const sortedData = data.data.sort(
                    (a: Job, b: Job) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
                setJobs(sortedData);
                setTotalItems(data.totalItems);
                setLoading(false);
            } catch (err) {
                setError('Có lỗi xảy ra khi lấy dữ liệu');
                setLoading(false);
            }
        };

        loadJobsBySkip();
    }, [currentPage, fetchJobsBySkip]);

    useEffect(() => {
        const loadAllJobs = async () => {
            try {
                const data = await fetchAllJobs(); // Gọi từ context
                const sortedData = data.data.sort(
                    (a: Job, b: Job) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
                setAllJobData(sortedData);
                setLoading(false);
            } catch (err) {
                setError('Có lỗi xảy ra khi lấy dữ liệu');
                setLoading(false);
            }
        };

        loadAllJobs();
    }, [fetchAllJobs]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.Home}>
            <BannerSearch />

            <section className={styles['wrapper-home']}>
                <h3>
                    <p>Phổ Biến & Hàng Đầu</p> Công Ty Tuyển Dụng
                </h3>
                <div className={styles['wrapper-container']}>
                    <Swiper
                        cssMode={true}
                        navigation={true}
                        pagination={false}
                        mousewheel={true}
                        keyboard={true}
                        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
                        className="mySwiper_companyslide"
                        slidesPerView={5}
                        spaceBetween={20}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                        }}
                    >
                        {Array.from(new Map(allJobData.map((job) => [job.company.name, job])).values()).map(
                            (company) => (
                                <SwiperSlide
                                    key={company.jobId}
                                    onClick={() => router.push(`/companies/${company.company.name}`)}
                                >
                                    <div className={styles['company']} title={company.company.name}>
                                        <div className={styles['img-company']}>
                                            {company.company.images[0]?.image_company ? (
                                                <img
                                                    src={company.company.images[0]?.image_company}
                                                    alt={company.company.name}
                                                />
                                            ) : null}
                                        </div>
                                        <div className={styles['content-company']}>
                                            <h3 className={styles['name-company']}>{company.company.name}</h3>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>
                </div>
            </section>

            <section className={styles['wrapper-home']}>
                <div className={styles['header-recruitment']}>
                    <h3>
                        <p>Tuyển dụng</p> Việc Làm Tốt Nhất
                    </h3>
                </div>

                <div className={styles['recruitment-container']}>
                    {loading
                        ? Home_Skeleton()
                        : jobs.map((job) => (
                              <div
                                  onClick={() => window.open(`/jobs/job_details/${job.jobId}`, '_blank')}
                                  className={styles.job}
                                  key={job.jobId}
                                  style={{ cursor: 'pointer' }}
                              >
                                  <HotJob isHot={job.Hot_Job !== 'Null'}> {job.Hot_Job}</HotJob>
                                  <span className={styles['icon-views']}>
                                      <FontAwesomeIcon icon={faEye} />
                                      {job.view}
                                  </span>
                                  <div className={styles['img-company']}>
                                      <img src={job.company.images[0]?.image_company} alt={job.company.name} />
                                  </div>
                                  <div className={styles['content-company']}>
                                      <div className={styles['company-location']}>
                                          <h3 className={styles['title-company']} title={job.title}>
                                              {job.title}
                                          </h3>
                                          <span className={styles['name-company']} title={job.company.name}>
                                              {job.company.name}
                                          </span>
                                          <span className={styles['salary']} title={job.salary}>
                                              {job.salary_from === 0 && job.salary_to === 0 ? (
                                                  <>Thỏa thuận</>
                                              ) : (
                                                  <> {formatSalary(job.salary)}</>
                                              )}
                                          </span>
                                          <span className={styles['positon']}>
                                              <p> {job.jobLevel.name.join(', ')}</p>
                                          </span>
                                          <span className={styles['district']} title={job.workLocation.district.name}>
                                              <CiLocationOn />
                                              {job.workLocation.district.name}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                </div>

                <div className={styles['pagination']}>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <span>
                        {currentPage} / {totalPages} Trang
                    </span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </section>

            <Regional_Recruitment />
            <ChartSection />
            <SearchTypes />
            <OutstandingTool />
            <NotificationCard />
            <OutstandingCompany />
        </div>
    );
}

export default Home;
