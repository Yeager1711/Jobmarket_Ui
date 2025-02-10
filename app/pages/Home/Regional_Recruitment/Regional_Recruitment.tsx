import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CiLocationOn } from 'react-icons/ci';
import styles from './Regional_Recruitment.module.scss';
import { Job } from 'app/interface/Job';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';

import Regional_Recruitment__Skeleton from './Regional_Recruitment__seleton';

import { PiDiamondsFour } from 'react-icons/pi';

import HotJob from 'app/Ultils/HotJob/HotJob';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

const Regional_Recruitment = () => {
    const [jobDistrict, setJobDistrict] = useState([]); // Dùng cho hiển thị tên khu vực
    const [jobDistrictEncoded, setJobDistrictEncoded] = useState([]); // Dùng cho URL

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${apiUrl}/jobs/all-jobsTypes`);
                const result = await response.json();
                const jobDistrictData = result?.data?.category?.jobDistrict || [];
                const jobDistrictEncodedData = result?.data?.category?.jobDistrict_encode || [];

                setJobDistrict(jobDistrictData); // Cập nhật state cho tên khu vực
                setJobDistrictEncoded(jobDistrictEncodedData); // Cập nhật state cho URL
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <section className={styles.Regional_Recruitment}>
            <h3>Thị Trường tuyển dụng theo khu vực</h3>

            <div className={styles.Regional_Recruitment__wrapper}>
                <Swiper
                    cssMode={true}
                    navigation={true}
                    pagination={false}
                    mousewheel={true}
                    keyboard={true}
                    modules={[Navigation]}
                    className="mySwiper_companyslide"
                    slidesPerView={3}
                    spaceBetween={20}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 2.5 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {loading ? (
                        <Regional_Recruitment__Skeleton />
                    ) : (
                        jobDistrict.map((district, index) => (
                            <SwiperSlide key={district}>
                                <div className={styles.Regional_Recruitment__box}>
                                    <div className={styles.images}>
                                        <img src={`/images/Area/Area_${index + 1}.jpg`} alt="" />
                                    </div>
                                    <div className={styles.notification}>
                                        <span>Now</span>
                                        <i className="fas fa-bell"></i>
                                    </div>
                                    <h3>We are Hiring</h3>
                                    <h2>Area {district}</h2>
                                    <div className={styles.jobTypes}>
                                        <button className={`${styles.jobType} ${styles.active}`}>Full time</button>
                                    </div>
                                    <div className={styles.salary}>
                                        <span> Up to 5.000$</span>
                                        <span></span>
                                    </div>
                                    <a
                                        className={styles.applyNow}
                                        href={`/Job_District/${jobDistrictEncoded[index]}`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Apply Now
                                    </a>
                                </div>
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>
            </div>
        </section>
    );
};

export default Regional_Recruitment;
