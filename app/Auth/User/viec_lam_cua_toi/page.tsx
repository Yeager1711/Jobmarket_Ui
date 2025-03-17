'use client';
import { useState, useEffect } from 'react';
import styles from './myJob.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import UserControl from '../userControl/UserControl';
import { useApi } from '../../../Context/ApiContext/ApiContext';
import { formatSalary } from '../../../Ultils/formatSalary';
import MyJob_Skeleton from './myJob_Skeleton';
import CVAnalysisPopup from '../popup/CVAnalysisPopup/page';
import PaymentPopup from '../popup/PaymentPopup/page';
import { Job } from '../../../interface/Job';
// Define types for FavoriteJob
interface CompanyImage {
    image_company: string;
}

// interface Job {
//     jobId: number;
//     title: string;
//     salary_from: number;
//     salary_to: number;
//     company: {
//         name: string;
//         images: CompanyImage[];
//     };
//     workLocation: {
//         address_name: string; // Sửa từ district.name thành address_name
//     };
// }

interface FavoriteJob {
    favoriteId: number;
    job: Job;
}

function MyJob() {
    const [activeTab, setActiveTab] = useState<'myJobs' | 'savedJobs'>('myJobs');
    const [favoriteJobs, setFavoriteJobs] = useState<FavoriteJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState<{
        open: boolean;
        jobTitle?: string;
        jobId?: number;
        job?: Job;
    }>({ open: false });
    const { getUserFavoriteJobs } = useApi();

    useEffect(() => {
        if (activeTab === 'savedJobs') {
            const fetchFavoriteJobs = async () => {
                setLoading(true);
                try {
                    const data = await getUserFavoriteJobs();
                    console.log('Dữ liệu từ getUserFavoriteJobs:', data);
                    setFavoriteJobs(data || []);
                } catch (error) {
                    console.error('Error fetching favorite jobs:', error);
                    setFavoriteJobs([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchFavoriteJobs();
        }
    }, [activeTab, getUserFavoriteJobs]);

    const renderAppliedJobs = () => {
        return <div className={styles.myJob__applied}></div>;
    };

    const renderSavedJobs = () => {
        if (loading) {
            return <MyJob_Skeleton />;
        }

        if (favoriteJobs.length === 0) {
            return (
                <div className={styles.job_favorite_empty}>
                    <img
                        src="https://via.placeholder.com/150x150.png?text=📄"
                        alt="No jobs"
                        className={styles.placeholderImage}
                    />
                    <p>Bạn chưa lưu công việc nào</p>
                    <a href="/jobs" className={styles.link}>
                        Tìm việc làm phù hợp
                    </a>
                </div>
            );
        }

        return (
            <div className={styles.job_favorite_lists}>
                {favoriteJobs.map((jobItem) => {
                    const salaryString =
                        jobItem.job.salary_from && jobItem.job.salary_to
                            ? `${jobItem.job.salary_from} to ${jobItem.job.salary_to} VND`
                            : jobItem.job.salary_from
                            ? `Up to ${jobItem.job.salary_from} VND`
                            : 'Thương lượng';

                    return (
                        <div key={jobItem.favoriteId} className={styles.box_favorite_job}>
                            <div className={styles.image_company}>
                                <img
                                    src={
                                        jobItem.job.company.images[0]?.image_company ||
                                        'https://via.placeholder.com/150'
                                    }
                                    alt={jobItem.job.company.name}
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/150';
                                    }}
                                />
                            </div>

                            <div className={styles.job_favorite_content__company}>
                                <h3 className={styles.title}>{jobItem.job.title}</h3>
                                <div className={styles.box_marLeft}>
                                    <span className={styles.company_name}>
                                        {jobItem.job.company.name}
                                    </span>
                                    <span className={styles.district_name}>
                                        {jobItem.job.workLocation.address_name}
                                    </span>
                                    <span className={styles.salary}>
                                        {formatSalary(salaryString)}
                                    </span>
                                    <span
                                        className={styles.AI_analysis}
                                        onClick={() =>
                                            setIsPopupOpen({
                                                open: true,
                                                jobTitle: jobItem.job.title,
                                                job: jobItem.job,
                                                jobId: jobItem.job.jobId
                                            })
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="15"
                                            viewBox="0 0 32 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M7.00212 3.07087C6.45598 3.25137 6.45598 4.0243 7.00212 4.20326C8.26102 4.61672 9.24839 5.60564 9.66339 6.86453C9.84389 7.41067 10.6168 7.41067 10.7958 6.86453C11.2092 5.60564 12.1981 4.61826 13.457 4.20326C14.0032 4.02276 14.0032 3.24983 13.457 3.07087C12.1981 2.65741 11.2108 1.6685 10.7958 0.409604C10.6153 -0.136535 9.84235 -0.136535 9.66339 0.409604C9.24839 1.67004 8.26102 2.65741 7.00212 3.07087ZM24.3366 2.14521C24.1237 1.49725 23.2058 1.49725 22.9929 2.14521L21.9963 5.17829C21.5057 6.67168 20.3332 7.84264 18.8413 8.33324L15.8082 9.32987C15.1603 9.54277 15.1603 10.4607 15.8082 10.6736L18.8413 11.6702C20.3347 12.1608 21.5057 13.3333 21.9963 14.8252L22.9929 17.8583C23.2058 18.5062 24.1237 18.5062 24.3366 17.8583L25.3348 14.8252C25.8254 13.3318 26.9964 12.1608 28.4898 11.6702L31.5228 10.6736C32.1708 10.4607 32.1708 9.54277 31.5228 9.32987L28.4898 8.3317C26.9964 7.8411 25.8254 6.67014 25.3348 5.17675L24.3366 2.14521ZM13.7301 14.873C13.5172 14.225 12.5993 14.225 12.3864 14.873L12.2645 15.2448C11.7739 16.7382 10.6029 17.9092 9.10954 18.3998L8.73773 18.5216C8.08977 18.7345 8.08977 19.6525 8.73773 19.8654L9.10954 19.9873C10.6029 20.4779 11.7739 21.6488 12.2645 23.1422L12.3864 23.514C12.5993 24.162 13.5172 24.162 13.7301 23.514L13.852 23.1422C14.3426 21.6488 15.5151 20.4779 17.007 19.9873L17.3788 19.8654C18.0267 19.6525 18.0267 18.7345 17.3788 18.5216L17.007 18.3998C15.5136 17.9092 14.3426 16.7367 13.852 15.2448L13.7301 14.873Z"
                                                fill="url(#paint0_linear_35033_166622)"
                                            />
                                            <path
                                                d="M0.409604 11.9911C-0.136535 12.1716 -0.136535 12.9446 0.409604 13.1235C1.6685 13.537 2.65587 14.5259 3.07087 15.7848C3.25138 16.3309 4.0243 16.3309 4.20326 15.7848C4.61672 14.5259 5.60563 13.5385 6.86453 13.1235C7.41067 12.943 7.41067 12.1701 6.86453 11.9911C5.60563 11.5777 4.61826 10.5888 4.20326 9.32987C4.02276 8.78373 3.24983 8.78373 3.07087 9.32987C2.65587 10.5903 1.6685 11.5777 0.409604 11.9911Z"
                                                fill="url(#paint1_linear_35033_166622)"
                                            />
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_35033_166622"
                                                    x1="32.0088"
                                                    y1="12"
                                                    x2="0"
                                                    y2="12"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop stopColor="#B900F6" />
                                                    <stop offset="0.67" stopColor="#FF3C68" stopOpacity="0.3" />
                                                    <stop offset="1" stopColor="#FF6200" stopOpacity="0" />
                                                </linearGradient>
                                                <linearGradient
                                                    id="paint1_linear_35033_166622"
                                                    x1="32.0088"
                                                    y1="12"
                                                    x2="0"
                                                    y2="12"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop stopColor="#B900F6" />
                                                    <stop offset="0.67" stopColor="#FF3C68" stopOpacity="0.3" />
                                                    <stop offset="1" stopColor="#FF6200" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        Phân tích mức độ cạnh tranh CV của bạn với các ứng viên khác
                                    </span>
                                </div>
                            </div>

                            <div className={styles.flex_control__button}>
                                <div style={{ margin: 'auto', display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faHeart} />
                                    <button className={styles.btn_apply}>Ứng tuyển</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <section className={styles.myJob}>
            <div className={styles.wapper}>
                <UserControl />
                <div className={styles.myJob__details}>
                    <div className={styles.myJob__header}>
                        <h2>Việc làm của tôi</h2>
                    </div>

                    <div className={styles.myJob__tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'myJobs' ? styles.active : ''}`}
                            onClick={() => setActiveTab('myJobs')}
                        >
                            Việc đã ứng tuyển
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'savedJobs' ? styles.active : ''}`}
                            onClick={() => setActiveTab('savedJobs')}
                        >
                            Việc đã lưu
                        </button>
                    </div>

                    <div className={styles.myJob__content}>
                        {activeTab === 'myJobs' ? renderAppliedJobs() : renderSavedJobs()}
                    </div>
                </div>
            </div>
            <CVAnalysisPopup
                isOpen={isPopupOpen.open}
                jobTitle={isPopupOpen.jobTitle}
                jobId={isPopupOpen.jobId}
                job={isPopupOpen.job}
                onClose={() => setIsPopupOpen({ open: false })}
            />
            <PaymentPopup isOpen={false} onClose={() => {}} />
        </section>
    );
}

export default MyJob;