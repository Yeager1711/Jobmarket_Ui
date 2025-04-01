'use client';
import React, { useState } from 'react';
import styles from './extend_ai.module.scss';
import { FaQuestionCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';
import PopUpSelectCV_AI from 'app/Auth/User/popup/PopUpSelectCV_AI/page';
import { Job } from 'app/interface/Job';

interface ExtendAIProps {
    jobId: number;
    jobTitle?: string;
}

function ExtendAI({ jobId, jobTitle }: ExtendAIProps) {
    const [isOpenPopupCVAnalysisPopup, setIsOpenPopupCVAnalysisPopup] = useState<{
        open: boolean;
        jobId?: number;
        jobTitle?: string;
        job?: Job;
    }>({ open: false });

    const handleOpenPopup = () => {
        setIsOpenPopupCVAnalysisPopup({
            open: true,
            jobId: jobId,
            jobTitle: jobTitle,
            job: undefined, // Nếu bạn có dữ liệu Job đầy đủ, có thể truyền vào đây
        });
    };

    return (
        <div className={styles.ExtendAI}>
            <h3>Phân tích mức độ phù hợp của bạn với công việc</h3>

            <div className={styles.postion_img1}>
                <svg width="412" height="130" viewBox="0 0 412 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M446.116 123.629C446.119 123.635 446.113 123.641 446.107 123.638C390.586 94.6806 315.718 93.4027 310.568 93.3488C310.366 93.3467 310.184 93.3436 309.982 93.3375C227.379 90.8637 159.982 62.0166 153.185 59.0181C152.779 58.8391 152.415 58.6865 152.002 58.5245C97.8553 37.2806 47.2625 0.452444 43.4134 -2.37688C43.2388 -2.50522 43.091 -2.61158 42.9135 -2.73577C33.9569 -8.99984 24.1749 -14.8417 14.6375 -20.0437C-3.93921 -30.176 -3.94475 -57.0273 16.1876 -63.1258C68.4513 -78.9576 154.597 -96.6899 250.599 -82.5096C250.9 -82.4652 251.124 -82.4351 251.426 -82.3984C260.804 -81.2562 444.36 -56.7159 470.854 117.326C472.228 126.308 462.579 132.685 454.416 128.172L446.125 123.62C446.119 123.617 446.113 123.623 446.116 123.629Z"
                        fill="url(#paint0_linear_29878_282335)"
                        fillOpacity="0.2"
                    ></path>
                    <defs>
                        <linearGradient
                            id="paint0_linear_29878_282335"
                            x1="289.315"
                            y1="-188.344"
                            x2="104.419"
                            y2="338.095"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#82DCFF"></stop>
                            <stop offset="0.32" stopColor="#D4E4FF"></stop>
                            <stop offset="0.76" stopColor="#0047CC"></stop>
                            <stop offset="1" stopColor="#002466"></stop>
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className={styles.postion_img2}>
                <svg width="313" height="295" viewBox="0 0 313 295" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M-79.8671 7.08921C-79.8661 7.08291 -79.8579 7.08077 -79.8553 7.0866C-49.8027 73.2259 45.5915 233.247 298.167 341.306C318.347 349.939 318.009 377.068 296.635 382.063C215.191 401.097 66.2578 415.619 -45.7692 310.704C-45.9381 310.546 -46.0552 310.438 -46.2261 310.282C-51.5496 305.424 -161.006 202.541 -102.484 8.38912C-99.3496 -2.08324 -84.4704 -2.94093 -79.8795 7.09059C-79.8768 7.09639 -79.8681 7.09551 -79.8671 7.08921Z"
                        fill="url(#paint0_linear_29878_282334)"
                        fillOpacity="0.2"
                    ></path>
                    <defs>
                        <linearGradient
                            id="paint0_linear_29878_282334"
                            x1="-97.2294"
                            y1="365.187"
                            x2="336.727"
                            y2="41.5518"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#002466"></stop>
                            <stop offset="0.114147" stopColor="#0047CC"></stop>
                            <stop offset="0.435625" stopColor="#D4E4FF"></stop>
                            <stop offset="1" stopColor="#82DCFF"></stop>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className={styles.contentBox}>
                <div className={styles.content_first}>
                    <span>
                        <FontAwesomeIcon icon={faSnowflake} /> Bạn phù hợp bao nhiêu % với việc làm này?
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faSnowflake} /> Đâu là điểm mạnh, điểm yếu trong CV của bạn?
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faSnowflake} /> Kỹ năng nào của bạn phù hợp, kỹ năng nào của bạn còn
                        thiếu so với yêu cầu của Nhà Tuyển Dụng?
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faSnowflake} /> Đưa ra "Gợi ý cải thiện" giúp bạn hoàn thiện hơn?
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faSnowflake} /> Xếp hạng bạn so với các ứng viên khác đang ứng tuyển công
                        việc đó?
                    </span>
                </div>

                <div className={styles.content}></div>
                <div className={styles.footer}>
                    <span className={styles.price}>
                        Giá:{' '}
                        {Number(process.env.NEXT_PUBLIC_APP_PRICE_AI).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}{' '}
                        /lượt
                    </span>
                    <button className={styles.btn_tryNow} onClick={handleOpenPopup}>
                        Thử ngay
                    </button>
                </div>
            </div>
            {isOpenPopupCVAnalysisPopup.open && (
                <PopUpSelectCV_AI
                    isOpen={isOpenPopupCVAnalysisPopup.open}
                    jobId={isOpenPopupCVAnalysisPopup.jobId}
                    job={isOpenPopupCVAnalysisPopup.job}
                    onClose={() => setIsOpenPopupCVAnalysisPopup({ open: false })}
                />
            )}
        </div>
    );
}

export default ExtendAI;
