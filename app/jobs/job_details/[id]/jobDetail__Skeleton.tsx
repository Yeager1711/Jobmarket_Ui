// Jobs_Skeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Đảm bảo CSS của react-loading-skeleton được import
import styles from './jobDetail.module.scss';

const JobDetails_Skeleton = () => {
    return (
        <div key={0}>
            {Array.from({ length: 1 }).map((_, index) => (
                <div key={index}>
                    <div className={styles.company} >
                        <div className={styles.image_company}>
                            <Skeleton width={80} height={80} borderRadius={50}/>
                        </div>
                        <div className={styles.name_company}>
                            <Skeleton width={600} height={30} />

                            <span className={styles.basic_infomation_item}>
                                <Skeleton width={600} />
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
                        <div className={styles.infomation}>
                            <div className={styles.wrapper_infomation}>
                                <div className={styles.basic_infomation}>
                                    <h4 className={styles.infomation_Content_Title_job}>
                                        {' '}
                                        <Skeleton width={400} />
                                    </h4>
                                    <div className={styles.infomation_Content_section}>
                                        <span className={styles.basic_infomation_item}>
                                            Mức lương:
                                            <p>
                                                <Skeleton width={100} />
                                            </p>
                                        </span>
                                        <span className={styles.basic_infomation_item}>
                                            Kinh nghiệm:
                                            <p>
                                                {' '}
                                                <Skeleton width={100}  />
                                            </p>
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.basic_infomation_description}>
                                    <h3>Mô tả công việc</h3>
                                    <span>
                                        <Skeleton width={730} height={100} />
                                    </span>
                                </div>

                                <div className={styles.basic_infomation_requesment}>
                                    <h3>Yêu cầu ứng viên</h3>
                                    <span>
                                        <Skeleton width={730} height={100} />
                                    </span>
                                </div>

                                <div className={styles.basic_infomation_benifet}>
                                    <h3>Phúc lợi</h3>
                                    <span>
                                        <Skeleton width={730} height={100}  style={{marginTop: '1.5rem'}}/>
                                    </span>

                                    <span>
                                        <Skeleton width={730} height={100} />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.wraper__generalInformation}>
                            <div className={styles.generalInformation}>
                                <h3>Thông tin chung</h3>

                                <React.Fragment>
                                    <span className={styles.generalInformation_item}>
                                        Kinh nghiệm tối thiếu:{' '}
                                        <p>
                                            {' '}
                                            <Skeleton width={200} />
                                        </p>
                                    </span>

                                    <span className={styles.generalInformation_item}>
                                        Cấp bậc:{' '}
                                        <p>
                                            {' '}
                                            <Skeleton width={100} />
                                        </p>
                                    </span>

                                    <span className={styles.generalInformation_item}>
                                        Số lượng tuyển: <Skeleton width={100} />
                                    </span>

                                    <span className={styles.generalInformation_item}>
                                        Loại hợp đồng:{' '}
                                        <p>
                                            {' '}
                                            <Skeleton width={150} />
                                        </p>
                                    </span>

                                    <span className={styles.generalInformation_item}>
                                        Hình thức làm việc:{' '}
                                        <p>
                                            {' '}
                                            <Skeleton width={50} />
                                        </p>
                                    </span>
                                    <span className={styles.generalInformation_item}>
                                        Giới tính:{' '}
                                        <p>
                                            <Skeleton width={200} />
                                        </p>
                                    </span>

                                    <span className={styles.generalInformation_itemTech_Stack}>
                                        <p> Công nghệ sử dụng:</p>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            <Skeleton width={300} />
                                        </div>
                                    </span>
                                </React.Fragment>
                            </div>

                            <div className={styles.jobSame__company}>
                                <h3>
                                    <p>
                                        <Skeleton width={100} />
                                    </p>{' '}
                                    <Skeleton width={100} />
                                </h3>

                                <div className={styles.companyJobs}>
                                    <div className={styles.box_companyJob}>
                                        <div className={styles.logo__company}>
                                            <Skeleton width={100} height={100} />
                                        </div>

                                        <div className={styles.jobInfo}>
                                            <h2>
                                                <Skeleton width={400} />
                                            </h2>
                                            <p className={styles.job__experience}>
                                                <Skeleton width={100} />
                                            </p>
                                            <p className={styles.company__salary}>
                                                <Skeleton width={50} />
                                            </p>
                                            <p className={styles.company__location}>
                                                <Skeleton width={100} />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div >
    );
};

export default JobDetails_Skeleton;
