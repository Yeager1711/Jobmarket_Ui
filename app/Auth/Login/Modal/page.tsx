'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './Login.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void; // Callback để thông báo đăng nhập thành công
}

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');

        try {
            const response = await axios.post(
                `${apiUrl}/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            // Lưu accessToken vào localStorage
            localStorage.setItem('access_token', response.data.accessToken);
            // Lưu thông tin user nếu cần (tùy chọn)
            localStorage.setItem('user', JSON.stringify(response.data.user));

            showToastSuccess('Đăng nhập thành công');
            onLoginSuccess(); // Gọi callback để thông báo cho Header cập nhật thông tin user
            onClose(); // Đóng modal
            router.push('/'); // Điều hướng về trang chủ
        } catch (err: any) {
            if (err.response?.data?.field === 'email') {
                setEmailError(err.response.data.message);
            } else if (err.response?.data?.field === 'password') {
                setPasswordError(err.response.data.message);
            } else {
                setEmailError('');
                setPasswordError('Sai email hoặc mật khẩu');
            }
            showToastError('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.modalOverlay} ${isOpen ? styles.show : styles.hide}`}>
            <div className={`${styles.modalContent} ${isOpen ? styles.slideDown : styles.slideUp}`}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h3>Đăng nhập</h3>
                <div className={styles.boxContainer}>
                    <div className={styles.boxInput}>
                        <span>Email</span>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {emailError && <p className={styles.error}>{emailError}</p>}
                    </div>

                    <div className={styles.boxInput}>
                        <span>Mật khẩu</span>
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

                    <div className={styles.forgot_pass}>
                        <a href="">Quên mật khẩu ?</a>
                    </div>

                    <div className={styles.flex_control}>
                        <div className={styles.policyQuestion}>
                            <span>Bạn chưa có tài khoản của JobMarket ?</span>{' '}
                            <a href="/Auth/Register">Đăng ký</a>
                        </div>
                        <button className={styles.btnRegister} onClick={handleLogin}>
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;