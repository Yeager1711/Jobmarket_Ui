'use client';
import { useState, useEffect } from 'react';
import styles from './Popup_selectCv_ApplyJob.module.scss';
import { useApi } from '../../../../Context/ApiContext/ApiContext';
import { useRouter } from 'next/navigation';
import { Job } from '../../../../interface/Job';
import { showToastError, showToastSuccess } from '../../../../Ultils/toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
// Định nghĩa interface cho CV
interface CV {
    resumeCVId: number;
    name_file?: string;
    isDefault: boolean;
    updatedAt: string;
}

const emailDefault_contract = process.env.NEXT_PUBLIC_APP_EMAIL;

const Popup_selectCv_ApplyJob = ({
    isOpen,
    onClose,
    jobTitle,
    jobId,
}: {
    isOpen: boolean;
    onClose: () => void;
    job?: Job;
    jobId?: number;
    jobTitle?: string;
}) => {
    const { fetchCVs, user, applyJob } = useApi();
    const [cvs, setCvs] = useState<CV[]>([]);
    const router = useRouter();
    const [selectedCVId, setSelectedCVId] = useState<string | null>(null);
    const [letterIntroduction, setLetterIntroduction] = useState<string>('');

    useEffect(() => {
        const loadCVs = async () => {
            if (isOpen && user?.userId) {
                try {
                    const data = await fetchCVs(user.userId);
                    setCvs(data);
                    const defaultCV = data.find((cv: CV) => cv.isDefault);
                    if (defaultCV) {
                        setSelectedCVId(defaultCV.resumeCVId.toString());
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách CV:', error);
                    showToastError('Không thể tải danh sách CV. Vui lòng thử lại sau.');
                }
            }
        };
        loadCVs();
    }, [isOpen, user?.userId, fetchCVs]);

    if (!isOpen) return null;

    // Cập nhật hàm handleApplyJob
    const handleApplyJob = async () => {
        if (!jobId) {
            showToastError('Không tìm thấy Job ID hợp lệ. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
            return;
        }

        if (!selectedCVId) {
            showToastError('Vui lòng chọn một hồ sơ để ứng tuyển.');
            return;
        }

        try {
            await applyJob(jobId, parseInt(selectedCVId), letterIntroduction || undefined);
            showToastSuccess('Ứng tuyển công việc thành công!');
            onClose();
            setLetterIntroduction('')
        } catch (error) {
            console.log('Lỗi khi ứng tuyển:', error);
        }
    };

    // Cập nhật nút "Ứng tuyển công việc" trong return

    return (
        <div className={styles.popupOverlay} onClick={onClose}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.Popup_selectCv_ApplyJob_header}>
                    <h2>Ứng tuyển: "{jobTitle}"</h2>
                </div>

                <div className={styles.wrapper_option}>
                    <h3>Chọn hồ sơ CV có sẵn trên JobMarket</h3>
                    <div className={styles.options}>
                        {cvs.map((cv) => (
                            <div key={cv.resumeCVId} className={styles.option}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        id={`cv-${cv.resumeCVId}`}
                                        name="source"
                                        value={cv.resumeCVId}
                                        checked={selectedCVId === cv.resumeCVId.toString()}
                                        onChange={() => setSelectedCVId(cv.resumeCVId.toString())}
                                    />
                                    <label htmlFor={`cv-${cv.resumeCVId}`}>
                                        {cv.name_file || `CV ${cv.resumeCVId}`}
                                    </label>
                                </div>
                                <div className={styles.content_history}>
                                    <p>Hồ sơ {cv.isDefault ? 'mặc định' : 'đính kèm'}</p>
                                    <p>•</p>
                                    <p>Đã tải lên: {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}</p>
                                    <p>•</p>
                                    <p>
                                        Trạng thái:
                                        {cv.isDefault ? (
                                            <span style={{ color: '#24c724' }}> Được gợi ý để ứng tuyển </span>
                                        ) : (
                                            ' Sẵn sàng'
                                        )}
                                    </p>
                                </div>
                                {cv.isDefault && <div className={styles.CV_default}>CV được chọn làm mặc định</div>}
                            </div>
                        ))}

                        <div className={styles.letter_introductions}>
                            <h4>Phần giới thiệu:</h4>
                            <p>
                                Một phần giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng
                                hơn với nhà tuyển dụng.
                            </p>

                            <textarea
                                name="letter_introduction"
                                id="letter_introduction"
                                placeholder="Viết ngắn gọn về bản thân, nêu rõ mong muốn, điểm phù hợp với công việc ứng tuyển này."
                                value={letterIntroduction}
                                onChange={(e) => setLetterIntroduction(e.target.value)} 
                            ></textarea>
                        </div>

                        <div className={styles.warning_note}>
                            <h4>Lưu ý</h4>
                            <p>
                                1. <a>JobMarket</a> khuyên tất cả các bạn hãy luôn cẩn trọng trong quá trình tìm việc và
                                chủ động nghiên cứu về thông tin công ty, vị trí việc làm trước khi ứng tuyển. Ứng viên
                                cần có trách nhiệm với hành vi ứng tuyển của mình. Nếu bạn gặp phải tin tuyển dụng hoặc
                                nhận được liên lạc đáng ngờ của nhà tuyển dụng, hãy báo cáo ngay cho <a>JobMarket</a>{' '}
                                qua email <a href={`mailto:${emailDefault_contract}`}>{emailDefault_contract}</a> để
                                được hỗ trợ kịp thời.
                            </p>
                            <p>2. Tìm hiểu thêm kinh nghiệm phòng tránh lừa đảo</p>
                        </div>
                    </div>
                </div>

                <div className={styles.Popup_selectCv_ApplyJob_footers}>
                    <button className={styles.payButton} onClick={handleApplyJob} disabled={!selectedCVId}>
                        Nộp đơn ứng tuyển
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup_selectCv_ApplyJob;
