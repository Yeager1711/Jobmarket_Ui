'use client';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../../../interface/User';
import styles from './UserControl.module.scss';
import { useParams, usePathname } from 'next/navigation';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

export default function UserControl() {
    const [user, setUser] = useState<User | null>(null);
    const params = useParams();
    const pathname = usePathname();
    const userId = params?.userId;

    // Image
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current?.click();
        }
    };

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const response = await fetch(`${apiUrl}/users/${userId}`);
                if (!response.ok) throw new Error('Không thể lấy dữ liệu user');
                const data: User = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu user:', error);
            }
        };

        fetchUser();
    }, [userId]);

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

            const access_token = localStorage.getItem('access_token');
            if (!access_token) {
                showToastError('Token is required !');
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/users/${userId}/upload-image`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    showToastSuccess('Ảnh đã được cập nhật');
                } else {
                    showToastError('Lỗi trong quá trình tải lên ảnh!');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                showToastError('Đã xảy ra lỗi khi tải lên ảnh!');
            }
        } else {
            showToastError('Lỗi trong quá trình cập nhật ảnh !');
        }
    };

    return (
        <div className={styles.user_control}>
            <div className={styles.user_infomation}>
                {user ? (
                    <>
                        <div className={styles.image_user}>
                            <img
                                src={
                                    preview
                                        ? preview
                                        : user.image
                                          ? `${process.env.NEXT_PUBLIC_APP_API_BASE_URL}${user.image}`
                                          : '/images/user/user_default.png'
                                }
                                alt={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'User'}
                                width="200"
                            />

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
                    <p>Đang tải...</p>
                )}
            </div>

            <div className={styles.control_link}>
                <a
                    href={`/Auth/User/${userId}/tong_quan_tai_khoan`}
                    className={pathname.includes('tong_quan_tai_khoan') ? styles.active : ''}
                >
                    Tổng quan
                </a>
                <a
                    href={`/Auth/User/${userId}/ho_so_cua_toi`}
                    className={pathname.includes('ho_so_cua_toi') ? styles.active : ''}
                >
                    Hồ sơ của tôi
                </a>
                <a
                    href={`/Auth/User/${userId}/viec_lam_cua_toi`}
                    className={pathname.includes('viec_lam_cua_toi') ? styles.active : ''}
                >
                    Việc làm của tôi
                </a>
                <a
                    href={`/Auth/User/${userId}/quan_ly_tai_khoan`}
                    className={pathname.includes('quan_ly_tai_khoan') ? styles.active : ''}
                >
                    Quản lý tài khoản
                </a>
            </div>
        </div>
    );
}
