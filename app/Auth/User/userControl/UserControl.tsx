'use client';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../../interface/User';
import styles from './UserControl.module.scss';
import { useParams, usePathname } from 'next/navigation';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import UserController_Skeleton from './UserController_skeleton';
import { useApi } from '../../../Context/ApiContext/ApiContext';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

export default function UserControl() {
    const [user, setUser] = useState<User | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [timeLeft, setTimeLeft] = useState<string>('0:00');

    const pathname = usePathname();
    const { fetchUser, isReady, accessToken } = useApi();

    // Lấy userId từ token
    const [userId, setUserId] = useState<string | null>(null);

    // Image
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!isReady || !accessToken) {
                // showToastError('Vui lòng đăng nhập để xem thông tin');
                return;
            }

            try {
                const decoded: any = jwtDecode(accessToken);
                const userIdFromToken = decoded.userId;
                setUserId(userIdFromToken);

                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error('Lỗi khi giải mã token hoặc tải user:', error);
                showToastError('Token không hợp lệ hoặc không thể tải thông tin người dùng');
            }
        };

        loadData();
    }, [fetchUser, isReady, accessToken]); // Thêm isReady và accessToken vào dependency array

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };

            const formData = new FormData();
            formData.append('file', file);

            if (!accessToken || !userId) {
                showToastError('Token hoặc userId không hợp lệ!');
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/users/${userId}/upload-image`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    showToastSuccess('Ảnh đã được cập nhật');
                    // Cập nhật lại user để lấy ảnh mới (nếu cần)
                    const updatedUser = await fetchUser();
                    setUser(updatedUser);
                } else {
                    const errorData = await response.json();
                    showToastError(`Lỗi trong quá trình tải lên ảnh: ${errorData.message || 'Không xác định'}`);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                showToastError('Đã xảy ra lỗi khi tải lên ảnh!');
            }
        } else {
            showToastError('Lỗi trong quá trình cập nhật ảnh!');
        }
    };

    // Audio podcard
    const audioSrc = '/audio/podcard/podcard.mp3';

    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current) {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                const remainingTime = Math.max(duration - currentTime, 0);

                const minutes = Math.floor(remainingTime / 60);
                const seconds = Math.floor(remainingTime % 60);
                setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);

                const percent = (currentTime / duration) * 100;
                setProgress(percent);
            }
        };

        const audio = audioRef.current;
        audio?.addEventListener('timeupdate', updateProgress);

        return () => audio?.removeEventListener('timeupdate', updateProgress);
    }, []);

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <>
            <div className={styles.user_control}>
                <div className={styles.user_infomation}>
                    {user ? (
                        <>
                            <div className={styles.image_user}>
                                {preview || user?.image ? (
                                    <img
                                        src={
                                            preview
                                                ? preview
                                                : user.image && process.env.NEXT_PUBLIC_APP_API_BASE_URL
                                                  ? `${process.env.NEXT_PUBLIC_APP_API_BASE_URL}${user.image}`
                                                  : '/images/user/user_default.png'
                                        }
                                        alt={
                                            user?.firstName && user?.lastName
                                                ? `${user.firstName} ${user.lastName}`
                                                : 'User'
                                        }
                                        width="200"
                                        onError={(e) => {
                                            e.currentTarget.src = '/images/user/user_default.png'; // Fallback nếu không tải được hình
                                        }}
                                    />
                                ) : (
                                    <img src="/images/user/user_default.png" alt="User" width="200" />
                                )}

                                <div className={styles.btn_upload_imgUser}>
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        onClick={handleIconClick}
                                        style={{ cursor: 'pointer', fontSize: '24px' }}
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.infomation}>
                                <span className={styles.fullname}>{`${user.firstName} ${user.lastName}`}</span>
                                <span className={styles.candidate_code}>
                                    <p>Mã ứng viên:</p> #{user.userId}
                                </span>
                                <span className={styles.email}>{user.email}</span>
                            </div>
                        </>
                    ) : (
                        <UserController_Skeleton />
                    )}
                </div>

                <div className={styles.control_link}>
                    <a
                        href={`/Auth/User/tong_quan_tai_khoan`}
                        className={pathname.includes('tong_quan_tai_khoan') ? styles.active : ''}
                    >
                        Tổng quan
                    </a>
                    <a
                        href={`/Auth/User/ho_so_cua_toi`}
                        className={pathname.includes('ho_so_cua_toi') ? styles.active : ''}
                    >
                        Hồ sơ của tôi
                    </a>
                    <a
                        href={`/Auth/User/viec_lam_cua_toi`}
                        className={pathname.includes('viec_lam_cua_toi') ? styles.active : ''}
                    >
                        Việc làm của tôi
                    </a>

                    <a
                        href={`/Auth/User/quan_ly_tai_khoan`}
                        className={pathname.includes('quan_ly_tai_khoan') ? styles.active : ''}
                    >
                        Đơn hàng của tôi
                    </a>

                    <a
                        href={`/Auth/User/quan_ly_don_hang`}
                        className={pathname.includes('quan_ly_don_hang') ? styles.active : ''}
                    >
                        Quản lý tài khoản
                    </a>
                    
                </div>

                <>
                    <h2>Dành cho bạn: PodCard</h2>
                    <div className={styles.podcard}>
                        <motion.div
                            className={styles.music_wave}
                            animate={{ opacity: isPlaying ? [0.5, 1] : [1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
                        >
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={styles.waveBar}
                                    animate={{ height: isPlaying ? `${Math.random() * 100}%` : '10%' }}
                                    transition={{ repeat: Infinity, duration: 0.3, ease: 'easeInOut' }}
                                />
                            ))}
                        </motion.div>

                        <div className={styles.podcardContent}>
                            <h3>Mất động lực làm việc </h3>
                            <a
                                target="_blank"
                                href="https://www.tiktok.com/@bob.setuplivestream?is_from_webapp=1&sender_device=pc"
                            >
                                Cre: Bob 🤝
                            </a>
                            <p>27 Tháng 02 năm 2025 - Jobmarket</p>

                            <div className={styles.flex_audio}>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={handleSeek}
                                    className={styles.timeline}
                                />
                                <div className={styles.time_display}>
                                    <p className={styles.timeLeft}>{timeLeft}</p>
                                </div>
                                <button onClick={handlePlayPause} className={styles.playButton}>
                                    {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                                </button>
                            </div>
                            <audio ref={audioRef} src={audioSrc} />
                        </div>
                    </div>
                </>
            </div>
        </>
    );
}
