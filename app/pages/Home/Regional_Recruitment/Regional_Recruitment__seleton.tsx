// Jobs_Skeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './Regional_Recruitment.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';

const Regional_Recruitment__Skeleton = () => {
    return (
        <div style={{ display: 'flex', gap: '2rem'}}>
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={styles.Regional_Recruitment__wrapper}> {/* Added the key here */}
                    <div>
                        <div className={styles.Regional_Recruitment__box} style={{width: '45rem'}}>
                            <div className={styles.notification}>
                                <i className="fas fa-bell"></i>
                            </div>
                            <h3>
                                <Skeleton width={150}  />
                            </h3>
                            <h2>
                                <Skeleton width={120} />
                            </h2>
                            <div className={styles.jobTypes}>
                                <Skeleton width={70} height={20} borderRadius={5}/>
                            </div>
                            <div className={styles.salary}>
                                <span>
                                    <Skeleton width={100} />
                                </span>
                            </div>
                            <a>
                                <Skeleton width={410} height={30} />
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Regional_Recruitment__Skeleton;
