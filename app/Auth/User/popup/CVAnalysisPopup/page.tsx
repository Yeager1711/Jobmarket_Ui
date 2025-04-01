'use client';
import { useState, useEffect } from 'react';
import styles from './CVAnalysisPopup.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PopUpSelectCV_AI from '../PopUpSelectCV_AI/page';
import { Job } from '../../../../interface/Job';

interface CVAnalysisPopupProps {
    isOpen: boolean;
    jobTitle?: string;
    jobId?: number;
    job?: Job;
    onClose: () => void;
}

const CVAnalysisPopup = ({ isOpen, jobTitle, jobId, job, onClose }: CVAnalysisPopupProps) => {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [savedJobId, setSavedJobId] = useState<number | null>(null);
    const [isHidden, setIsHidden] = useState(false);

    // Cập nhật savedJobId khi jobId từ props thay đổi
    useEffect(() => {
        const effectiveJobId = jobId || 0; // Nếu jobId là undefined, dùng 0
        setSavedJobId(effectiveJobId);
        console.log('Updated savedJobId from props:', effectiveJobId);
    }, [jobId]);

    // Khi nhấn nút applyButton, mở PaymentPopup
    const handleApplyClick = () => {
        if (savedJobId === null || savedJobId === 0) {
            console.warn('savedJobId is invalid:', savedJobId);
            alert('Không tìm thấy Job ID hợp lệ. Vui lòng thử lại.');
            return;
        }
        setIsHidden(true); // Ẩn CVAnalysisPopup
        setIsPaymentOpen(true); // Mở PaymentPopup
    };

    // Khi đóng PaymentPopup
    const handlePaymentClose = () => {
        setIsPaymentOpen(false);
        setIsHidden(false)
    };

    if (!isOpen && !isPaymentOpen) return null;

    return (
        <>
            {isOpen && !isHidden && (
                <div className={styles.popupOverlay} onClick={onClose}>
                    <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.popup_header}>
                            <h2>Phân tích mức độ cạnh tranh</h2>
                            <p>
                                <img
                                    src="/svg/ai-analysis-icon.svg"
                                    alt="AI Analysis Icon"
                                    style={{ marginRight: '4px', width: '14px', height: '14px' }}
                                />{' '}
                                JobMarket AI {savedJobId || 'Không xác định'}
                            </p>
                        </div>

                        <div className={styles.image_bannerAI}>
                            <img src="/images/bannerAI.png" alt="" />
                            <div className={styles.content}>
                                <div className={styles.analysisBox}>
                                    <div className={styles.analysisItem}>
                                        <span className={styles.checkmark}>✔</span>
                                        <p>Bạn có hồ sơ bao gồm % cho vị trí này?</p>
                                    </div>
                                    <div className={styles.analysisItem}>
                                        <span className={styles.checkmark}>✔</span>
                                        <p>Bạn đang cạnh tranh Top bao nhiêu so với những ứng viên khác?</p>
                                    </div>
                                    <div className={styles.analysisItem}>
                                        <span className={styles.checkmark}>✔</span>
                                        <p>Thu nhập trung bình của bạn có thể đạt được?</p>
                                    </div>
                                    <div className={styles.analysisItem}>
                                        <span className={styles.checkmark}>✔</span>
                                        <p>Mức lương trung bình của ứng viên khác?</p>
                                    </div>
                                    <div className={styles.analysisItem}>
                                        <span className={styles.checkmark}>✔</span>
                                        <p>
                                            Giá{' '}
                                            {Number(process.env.NEXT_PUBLIC_APP_PRICE_AI).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}{' '}
                                            / lượt
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.popup_footer}>
                                <p className={styles.note}>
                                    Lưu ý: Bạn cần hoàn thiện hồ sơ để có thể nhận thêm thông tin nâng cao về ứng tuyển
                                </p>

                                <button className={styles.applyButton} onClick={handleApplyClick}>
                                    {Number(process.env.NEXT_PUBLIC_APP_PRICE_AI).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}{' '}
                                    / Lượt xem đánh giá <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isPaymentOpen && savedJobId && (
                <PopUpSelectCV_AI isOpen={isPaymentOpen} onClose={handlePaymentClose} job={job} jobId={savedJobId} />
            )}
        </>
    );
};

export default CVAnalysisPopup;
