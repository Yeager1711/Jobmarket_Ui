'use client';
import { useState } from 'react';
import styles from './Question.module.scss';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'app/Context/ApiContext/ApiContext'; // Import useApi

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    firstName?: string;
    lastName?: string;
    onConfirm?: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, firstName, lastName }) => {
    const { deleteAccountCurrent } = useApi(); // Sử dụng useApi để lấy deleteAccount
    const [loading, setLoading] = useState(false);
    const [confirmChecked, setConfirmChecked] = useState(false);

    if (!isOpen) return null;

    const handleDeleteAccount = async () => {
        if (!confirmChecked) {
            showToastError('Vui lòng xác nhận bạn muốn xóa tài khoản');
            return;
        }

        setLoading(true);
        try {
            const success = await deleteAccountCurrent(); 
            if (success) {
                onClose(); 
            }
        } catch (error) {
            console.error('Lỗi khi xóa tài khoản:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hiển thị tên người dùng nếu có
    const displayName = `${firstName || ''} ${lastName || ''}`.trim();
    const greeting = displayName ? ` ${displayName}` : '';

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Xóa tài khoản</h2>
                <div className={styles.style_header}>
                    <h4><FontAwesomeIcon icon={faSnowflake} /> {greeting}, {' '}</h4>
                    <p>{' '}Chúng tôi rất tiếc khi bạn muốn rời đi.</p>
                </div>
                <div className={styles.checkboxContainer}>
                    <div className={styles.condition}>
                        <h4>Một vài nhắc nhở khi thực hiện xóa tài khoản:</h4>
                        <div className={styles.condition_item}>
                            <p><FontAwesomeIcon icon={faCheck} />Tất cả các đơn ứng tuyển của bạn, sẽ không còn được nhìn thấy bởi nhà tuyển dụng.</p>
                            <p><FontAwesomeIcon icon={faCheck} />Những lời nhận xét hoặc đánh giá trước đó sẽ mất đi.</p>
                            <p><FontAwesomeIcon icon={faCheck} />Hồ sơ và CV tại JobMarket của bạn sẽ bị xóa hoàn toàn</p>
                            <p><FontAwesomeIcon icon={faCheck} />Bạn sẽ không nhận được những gợi ý công việc liên quan thông qua Email của JobMarket</p>
                            <p><FontAwesomeIcon icon={faCheck} />Bạn sẽ không thể hoàn tác tác vụ trước đó và khôi phục tài khoản đã xóa.</p>
                            <p className={styles.last_text}><FontAwesomeIcon icon={faCheck} />Điều cuối cùng: Thay mặt đội ngũ phát triển JobMarket. Chúc bạn thành công trong tương lai, và cảm ơn vì đã sử dụng dịch vụ của chúng tôi.</p>
                        </div>
                    </div>
                    <div className={styles.flex_checked__condition}>
                        <input
                            type="checkbox"
                            id="confirmDelete"
                            checked={confirmChecked}
                            onChange={(e) => setConfirmChecked(e.target.checked)}
                        />
                        <label htmlFor="confirmDelete">Tôi hiểu và đồng ý xóa tài khoản của mình vĩnh viễn</label>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.cancelButton} onClick={onClose} disabled={loading}>
                        Hủy
                    </button>
                    <button className={styles.confirmButton} onClick={handleDeleteAccount} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;