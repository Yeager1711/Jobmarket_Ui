// Jobs_Skeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Đảm bảo CSS của react-loading-skeleton được import
import styles from './styles/home.module.scss';

const Home_Skeleton = () => {
    return (
        <>
            {Array.from({ length: 12 }).map((_, index) => (
                <div className={styles['company']} key={index} style={{display: 'flex', gap: '1rem'}}>
                    <div className={styles['img-company']}>
                        <Skeleton height={80} width={80} borderRadius="8px" />
                    </div>

                    <div className={styles['content-company']}>
                        <div className={styles['company-location']}>
                            <h3 className={styles['title-company']}>
                                <Skeleton width={250} />
                            </h3>
                            <span className={styles['name-company']}>
                                <Skeleton width={180} style={{marginLeft: '3rem'}}/>
                            </span>

                            <span className={styles.salary} style={{marginLeft: '3rem'}}>
                                <Skeleton width={80} />
                            </span>

                            <span className={styles['positon']}>
                                <Skeleton width={80} style={{marginLeft: '3rem'}}/>
                            </span>
                            <span className={styles['district']}>
                                <Skeleton width={150} style={{marginLeft: '3rem'}}/>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Home_Skeleton;
