'use client';
import { useState } from 'react';
import styles from './accountSettingsModal.module.scss';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface AccountSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmail: string;
    onSave: (newEmail: string, currentPassword: string) => Promise<void>;
}

function AccountSettingsModal({ isOpen, onClose, currentEmail, onSave }: AccountSettingsModalProps) {
    const [email, setEmail] = useState(currentEmail);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState<string>(''); // Lưu trữ lỗi email
    const [passwordError, setPasswordError] = useState<string>(''); // Lưu trữ lỗi mật khẩu

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setEmailError('');
        setPasswordError('');

        // Kiểm tra dữ liệu trước khi gửi
        if (!email || email.trim() === '') {
            setEmailError('Vui lòng nhập email mới');
            setIsLoading(false);
            return;
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Email không hợp lệ');
            setIsLoading(false);
            return;
        }

        // Kiểm tra email phải có đuôi @gmail.com
        if (!email.toLowerCase().endsWith('@gmail.com')) {
            setEmailError('Email phải đúng địng dạng "@gmail.com');
            setIsLoading(false);
            return;
        }

        if (!password || password.trim() === '') {
            setPasswordError('Vui lòng nhập mật khẩu hiện tại');
            setIsLoading(false);
            return;
        }

        try {
            // Gọi prop onSave để gửi API /users/update-email
            await onSave(email, password);
            showToastSuccess('Cập nhật email thành công!');
            onClose();
        } catch (error: any) {
            console.error('Lỗi khi cập nhật email:', error);

            if (axios.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                if (status === 409) {
                    setEmailError(data.message || 'Email đã được sử dụng bởi người dùng khác');
                } else if (status === 401) {
                    setPasswordError(data.message || 'Mật khẩu hiện tại không đúng');
                } else {
                    showToastError('Không thể cập nhật email, vui lòng thử lại.');
                }
            } else {
                showToastError('Không thể cập nhật email, vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3>Thiết Lập Tài Khoản</h3>
                <form onSubmit={handleSubmit}>
                    <div className={styles.flex_input}>
                        <div className={styles.input_box}>
                            <label>Email đăng nhập hiện tại</label>
                            <input
                                type="email"
                                value={currentEmail}
                                disabled
                                className={styles.disabledInput}
                            />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faRightLeft} />
                        </div>
                        <div className={styles.input_box}>
                            <label>Email truy cập mới</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <p className={styles.error}>{emailError}</p>}
                        </div>
                    </div>

                    <div className={styles.input_box}>
                        <label>Mật khẩu hiện tại</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className={styles.eyeIcon}
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                        {passwordError && <p className={styles.error}>{passwordError}</p>}
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

export default AccountSettingsModal;