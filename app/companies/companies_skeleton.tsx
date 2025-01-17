// Jobs_Skeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Đảm bảo CSS của react-loading-skeleton được import
import styles from './companies.module.scss';

const Companies_Skeleton = () => {
    return (
        <div>
            {Array.from({ length: 10 }).map((_, index) => (
                <div className={styles['box-company']} key={index}>
                    <div className={styles['company-logo__wrapper']}>
                        <div className={styles['company-logo']}>
                            <Skeleton width={80} height={80} borderRadius={50} />
                        </div>
                        <div className={styles['company-logo__border']}>
                            <Skeleton width={55} height={55} borderRadius={50} />
                        </div>
                        <div className={styles['company-content']}>
                            <h3>
                                <Skeleton width={250} height={20} />
                            </h3>
                            <div className={styles['company-content__details']}>
                                <span className={styles['company-district']}>
                                    <Skeleton width={80} />
                                </span>
                                <span className={styles['total__job']}>
                                    <Skeleton width={200} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Companies_Skeleton;
