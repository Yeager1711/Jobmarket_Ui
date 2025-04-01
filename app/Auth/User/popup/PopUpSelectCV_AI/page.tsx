'use client';
import { useState, useEffect } from 'react';
import styles from './PopUpSelectCV_AI.module.scss';
import { useApi } from '../../../../Context/ApiContext/ApiContext';
import { useRouter } from 'next/navigation';
import { Job } from '../../../../interface/Job';
import { showToastError, showToastSuccess } from '../../../../Ultils/toast';

// Định nghĩa interface cho CV
interface CV {
    resumeCVId: number;
    name_file?: string;
    isDefault: boolean;
    updatedAt: string;
}

const PopUpSelectCV_AI = ({
    isOpen,
    onClose,
    job,
    jobId,
}: {
    isOpen: boolean;
    onClose: () => void;
    job?: Job;
    jobId?: number;
}) => {
    const { fetchCVs, user } = useApi();
    const [cvs, setCvs] = useState<CV[]>([]);
    const router = useRouter();
    const [selectedCVId, setSelectedCVId] = useState<string | null>(null);

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

    const handlePayClick = () => {
        onClose();

        if (!jobId) {
            showToastError('Không tìm thấy Job ID hợp lệ. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
            return;
        }

        if (!selectedCVId) {
            showToastError('Vui lòng chọn một hồ sơ để tiếp tục.');
            return;
        }

        router.push(`/Auth/User/checkout?jobId=${jobId}&resumeCVId=${selectedCVId}`);
    };

    return (
        <div className={styles.popupOverlay} onClick={onClose}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.PopUpSelectCV_AI_header}>
                    <h2>Lựa chọn hồ sơ để đánh giá với</h2>
                </div>

                <div className={styles.wrapper_option}>
                    <h3>Chọn hồ sơ có sẵn trên JobMarket</h3>
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
                                            <span style={{ color: '#24c724' }}> Được chọn để phân tích </span>
                                        ) : (
                                            ' sẵn sàng'
                                        )}
                                    </p>
                                    <p>CV ID: {cv.resumeCVId}</p>
                                </div>
                                {cv.isDefault && <div className={styles.CV_default}>CV được chọn làm mặc định</div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.PopUpSelectCV_AI_footers}>
                    <button className={styles.payButton} onClick={handlePayClick} disabled={!selectedCVId}>
                        Thanh toán để xem kết quả
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUpSelectCV_AI;
