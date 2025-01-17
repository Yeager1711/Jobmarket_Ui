// Jobs_Skeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Đảm bảo CSS của react-loading-skeleton được import
import styles from './BannerSearch.module.scss';

const BannerSearch_Skeleton = () => {
    return (
        <div>
            {Array.from({ length: 5 }).map((_, index) => (
                <div className={styles.jobs_new}>
                    <div key={index} className={styles['job-item']}>
                        <div className={styles['image-company']}>
                            <Skeleton width={40} height={40} borderRadius={50} />
                        </div>

                        <div style={{ flex: '1 1' }}>
                            <div className={styles['job-title']}>
                                <Skeleton width={220} borderRadius={50} />
                            </div>
                            <div className={styles['job-location']}>
                                <Skeleton width={120}  borderRadius={50} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BannerSearch_Skeleton;
