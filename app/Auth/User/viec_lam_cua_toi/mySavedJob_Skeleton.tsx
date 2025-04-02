'use client';
import styles from './myJob.module.scss'; // Sử dụng cùng styles với MyJob

const MySavedJob_Skeleton = () => {
    return (
        <section className={styles.myJob}>
            <div className={styles.wapper}>
                {/* Skeleton cho UserControl */}
                <div className={styles.userControlSkeleton}>
                    <div className={styles.skeletonUserAvatar}></div>
                    <div className={styles.skeletonUserInfo}>
                        <div className={styles.skeletonText}></div>
                        <div className={styles.skeletonText}></div>
                    </div>
                </div>

                <div className={styles.myJob__details}>
                    {/* Skeleton cho Header */}
                    <div className={styles.myJob__header}>
                        <div className={styles.skeletonHeader}></div>
                    </div>

                    {/* Skeleton cho Tabs */}
                    <div className={styles.myJob__tabs}>
                        <div className={styles.skeletonTab}></div>
                        <div className={styles.skeletonTab}></div>
                    </div>

                    {/* Skeleton cho Nội dung Saved Jobs */}
                    <div className={styles.myJob__content}>
                        <div className={styles.job_favorite_lists}>
                            {/* Hiển thị 3 skeleton jobs để mô phỏng danh sách */}
                            {[1, 2, 3].map((_, index) => (
                                <div key={index} className={styles.box_favorite_job}>
                                    {/* Skeleton cho hình ảnh công ty */}
                                    <div className={styles.image_company}>
                                        <div className={styles.skeletonImage}></div>
                                    </div>

                                    {/* Skeleton cho nội dung job */}
                                    <div className={styles.job_favorite_content__company}>
                                        <div className={styles.skeletonTitle}></div>
                                        <div className={styles.box_marLeft}>
                                            <div className={styles.skeletonText}></div>
                                            <div className={styles.skeletonText}></div>
                                            <div className={styles.skeletonText}></div>
                                            <div className={styles.skeletonAnalysis}></div>
                                        </div>
                                    </div>

                                    {/* Skeleton cho nút điều khiển */}
                                    <div className={styles.flex_control__button}>
                                        <div className={styles.skeletonButton}></div>
                                        <div className={styles.skeletonButton}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MySavedJob_Skeleton;