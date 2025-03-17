'use client';
import { useState, useEffect } from 'react';
import styles from './PaymentPopup.module.scss';
import { useApi } from '../../../../Context/ApiContext/ApiContext';
import { useRouter } from 'next/navigation';
import { Job } from '../../../../interface/Job';
import { showToastError, showToastSuccess } from '../../../../Ultils/toast';

const PaymentPopup = ({
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
    const [cvs, setCvs] = useState<any[]>([]);
    const router = useRouter();
    const [selectedCVId, setSelectedCVId] = useState<string | null>(null); // Theo dõi CV được chọn

    useEffect(() => {
        const loadCVs = async () => {
            if (isOpen && user?.userId) {
                try {
                    const data = await fetchCVs(user.userId);
                    setCvs(data);
                    // Nếu có CV mặc định, tự động chọn nó
                    const defaultCV = data.find((cv: any) => cv.isDefault);
                    if (defaultCV) {
                        setSelectedCVId(defaultCV.resumeCVId.toString());
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách CV:', error);
                }
            }
        };
        loadCVs();
    }, [isOpen, user?.userId, fetchCVs]);

    if (!isOpen) return null;

    const handlePayClick = () => {
        onClose();
        if (!jobId || jobId === 0) {
            showToastError('Không có jobId hợp lệ để thực hiện thanh toán!');
            showToastError('Không tìm thấy Job ID hợp lệ. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
            return;
        }
        if (!selectedCVId) {
            showToastError('Vui lòng chọn một hồ sơ trước khi thanh toán!');
            showToastError('Vui lòng chọn một hồ sơ để tiếp tục.');
            return;
        }
        router.push(`/Auth/User/checkout?jobId=${jobId}`);
    };


    return (
        <div className={styles.popupOverlay} onClick={onClose}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.PaymentPopup_header}>
                    <h2>Lựa chọn hồ sơ để đánh giá với Job ID: {jobId || 'Không xác định'}</h2>
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
                                        checked={selectedCVId === cv.resumeCVId.toString()} // Đồng bộ checked với state
                                        onChange={() => setSelectedCVId(cv.resumeCVId.toString())} // Cập nhật state khi chọn
                                    />
                                    <label htmlFor={`cv-${cv.resumeCVId}`}>
                                        {cv.name_file || `CV ${cv.resumeCVId}`}
                                    </label>
                                </div>
                                <div className={styles.content_history}>
                                    <p>Hồ sơ {cv.isDefault ? 'mặc định' : 'đính kèm'}</p>
                                    <p>•</p>
                                    <p>Đã tải lên: {new Date(cv.updatedAt).toLocaleDateString()}</p>
                                    <p>•</p>
                                    <p>Trạng thái: {cv.isDefault ? 'được phê duyệt' : 'sẵn sàng'}</p>
                                </div>
                                {cv.isDefault && <div className={styles.CV_default}>CV được chọn làm mặc định</div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.PaymentPopup_footers} onClick={handlePayClick}>
                    <button
                        className={styles.payButton}
                        disabled={!selectedCVId} // Vô hiệu hóa nút nếu không chọn CV
                    >
                        Thanh toán để xem kết quả
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPopup;
