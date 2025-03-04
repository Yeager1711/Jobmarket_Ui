'use client';
import { useState } from 'react';
import styles from './ChangePassword.module.scss';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface ChangePasswordProps {
    isOpen: boolean;
    onClose: () => void;
    onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

function ChangePassword({ isOpen, onClose, onChangePassword }: ChangePasswordProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPasswordError, setCurrentPasswordError] = useState<string>(''); // Lỗi mật khẩu hiện tại
    const [newPasswordError, setNewPasswordError] = useState<string>(''); // Lỗi mật khẩu mới
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>(''); // Lỗi xác nhận mật khẩu

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setCurrentPasswordError('');
        setNewPasswordError('');
        setConfirmPasswordError('');

        // Kiểm tra dữ liệu trước khi gửi
        if (!currentPassword || currentPassword.trim() === '') {
            const errorMsg = 'Vui lòng nhập mật khẩu hiện tại';
            console.log('Lỗi mật khẩu hiện tại:', errorMsg);
            setCurrentPasswordError(errorMsg);
            setIsLoading(false);
            return;
        }

        if (!newPassword || newPassword.trim() === '') {
            const errorMsg = 'Vui lòng nhập mật khẩu mới';
            console.log('Lỗi mật khẩu mới:', errorMsg);
            setNewPasswordError(errorMsg);
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            const errorMsg = 'Mật khẩu mới phải có ít nhất 8 ký tự';
            console.log('Lỗi mật khẩu mới:', errorMsg);
            setNewPasswordError(errorMsg);
            setIsLoading(false);
            return;
        }

        // Kiểm tra mật khẩu mới phải có: 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt, 1 số
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            const errorMsg =
                'Mật khẩu mới phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (VD: Matkhau@123)';
            console.log('Lỗi mật khẩu mới:', errorMsg);
            setNewPasswordError(errorMsg);
            setIsLoading(false);
            return;
        }

        if (!confirmPassword || confirmPassword.trim() === '') {
            const errorMsg = 'Vui lòng nhập xác nhận mật khẩu';
            console.log('Lỗi xác nhận mật khẩu:', errorMsg);
            setConfirmPasswordError(errorMsg);
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            const errorMsg = 'Mật khẩu xác nhận không đúng';
            console.log('Lỗi xác nhận mật khẩu:', errorMsg);
            setConfirmPasswordError(errorMsg);
            setIsLoading(false);
            return;
        }

        try {
            await onChangePassword(currentPassword, newPassword);
            showToastSuccess('Đổi mật khẩu thành công!');
            onClose();
        } catch (error: any) {
            console.error('Lỗi khi đổi mật khẩu:', error);

            if (axios.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    const errorMsg = data.message || 'Mật khẩu hiện tại không đúng';
                    console.log('Lỗi API đổi mật khẩu:', errorMsg);
                    setCurrentPasswordError(errorMsg);
                } else if (status === 400) {
                    // Xử lý các lỗi Bad Request (VD: mật khẩu mới trùng cũ)
                    const errorMsg = data.message || 'Lỗi khi đổi mật khẩu';
                    console.log('Lỗi API đổi mật khẩu:', errorMsg);
                    setCurrentPasswordError(errorMsg); // Hiển thị lỗi từ API
                } else {
                    const errorMsg = 'Không thể đổi mật khẩu, vui lòng thử lại.';
                    console.log('Lỗi API đổi mật khẩu:', errorMsg);
                    showToastError(errorMsg);
                }
            } else {
                const errorMsg = 'Không thể đổi mật khẩu, vui lòng thử lại.';
                console.log('Lỗi API đổi mật khẩu:', errorMsg);
                showToastError(errorMsg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3>Thay Đổi Mật Khẩu</h3>
                <form onSubmit={handleSubmit}>
                    <div className={styles.input_box}>
                        <label>Mật khẩu hiện tại</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showCurrentPassword ? faEyeSlash : faEye}
                                className={styles.eyeIcon}
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                        </div>
                        {currentPasswordError && <p className={styles.error}>{currentPasswordError}</p>}
                    </div>

                    <div className={styles.input_box}>
                        <label>Mật khẩu mới</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showNewPassword ? faEyeSlash : faEye}
                                className={styles.eyeIcon}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            />
                        </div>
                        {newPasswordError && <p className={styles.error}>{newPasswordError}</p>}
                    </div>

                    <div className={styles.input_box}>
                        <label>Xác nhận mật khẩu</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showConfirmPassword ? faEyeSlash : faEye}
                                className={styles.eyeIcon}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>
                        {confirmPasswordError && <p className={styles.error}>{confirmPasswordError}</p>}
                    </div>

                    <div className={styles.modalActions}>
                        <div></div>
                        <button type="submit" className={styles.saveButton} disabled={isLoading}>
                            {isLoading ? 'Đang lưu...' : 'Thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;