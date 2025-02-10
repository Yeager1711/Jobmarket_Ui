'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import styles from './Login.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
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
    
            // Lưu accessToken hoặc thông tin người dùng vào localStorage
            localStorage.setItem('access_token', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
    
            onClose();
            router.push('/');
        } catch (err: any) {
            if (err.response?.data?.field === 'email') {
                setEmailError(err.response.data.message);
            } else if (err.response?.data?.field === 'password') {
                setPasswordError(err.response.data.message);
            } else {
                setEmailError('');
                setPasswordError('Sai email hoặc mật khẩu');
            }
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

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.forgot_pass}>
                        <a href="">Quên mật khẩu ?</a>
                    </div>

                    <div className={styles.flex_control}>
                        <div className={styles.policyQuestion}>
                            <span>Bạn chưa có tài khoản của JobMarket ?</span> <a href="/Auth/Register">Đăng ký </a>
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
