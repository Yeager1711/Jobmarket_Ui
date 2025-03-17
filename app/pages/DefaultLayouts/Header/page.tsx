'use client';
import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { HiOutlineXMark } from 'react-icons/hi2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './header.module.scss';
import LoginModal from '../../../Auth/Login/Modal/page';
import { useApi } from '../../../Context/ApiContext/ApiContext';
import { showToastError } from 'app/Ultils/toast';

const cx = classNames.bind(styles);

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, fetchUser, Funclogout, isReady, accessToken } = useApi();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Memoize toggleDrawer để tránh tạo lại hàm
    const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

    // Callback khi đăng nhập thành công
    const handleLoginSuccess = useCallback(async () => {
        setIsLoginModalOpen(false); // Đóng modal sau khi đăng nhập thành công
        try {
            await fetchUser(); // Gọi lại fetchUser để cập nhật user
        } catch (error) {
            showToastError('Không thể tải thông tin người dùng sau khi đăng nhập');
            console.error('Error fetching user after login:', error);
        }
    }, [fetchUser]);

    // Memoize handleLogout
    const handleLogout = useCallback(async () => {
        try {
            await Funclogout();
            router.push('/');
        } catch (error: any) {
            showToastError('Đăng xuất thất bại, vui lòng thử lại');
            console.error('Lỗi khi đăng xuất:', error);
        }
    }, [Funclogout, router]);

    // Kiểm tra trạng thái sẵn sàng và tải dữ liệu
    useEffect(() => {
        if (isReady) {
            if (accessToken) {
                // Nếu có accessToken, chờ fetchUser hoàn tất
                fetchUser()
                    .then(() => setIsLoading(false))
                    .catch((error) => {
                        setIsLoading(false);
                        showToastError('Không thể tải thông tin người dùng');
                        console.error('Error fetching user:', error);
                    });
            } else {
                setIsLoading(false); // Nếu không có token, không cần loading
            }
        }
    }, [isReady, accessToken, fetchUser]);

    if (pathname === '/Auth/Register') return null;

    // Hiển thị skeleton nếu dữ liệu chưa sẵn sàng
    if (isLoading) {
        return (
            <header className={cx('header_wrapper')}>
                <Link href="/" className={cx('logo')}>
                    <img src="/logo/logo_website.png" alt="Logo" />
                </Link>
                <nav className={cx('navbar')}>
                    {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} width={80} height={20} style={{ marginRight: '20px' }} />
                    ))}
                </nav>
                <div className={cx('button-control')}>
                    <Skeleton width={120} height={40} style={{ marginRight: '10px' }} />
                    <Skeleton width={120} height={40} style={{ marginRight: '10px' }} />
                    <div className={cx('employer')}>
                        <Skeleton width={150} height={20} />
                    </div>
                </div>
                <div className={cx('menu-icon')}>
                    <Skeleton width={24} height={24} />
                </div>
            </header>
        );
    }

    return (
        <>
            <header className={cx('header_wrapper')}>
                <Link href="/" className={cx('logo')}>
                    <img src="/logo/logo_website.png" alt="Logo" />
                </Link>

                <nav className={cx('navbar', { open: isDrawerOpen })}>
                    <Link href="/" className={cx('nav-link', { active: pathname === '/' })} prefetch>
                        Trang chủ
                    </Link>
                    <Link href="/jobs" className={cx('nav-link', { active: pathname === '/jobs' })} prefetch>
                        Việc làm
                    </Link>
                    <Link href="/companies" className={cx('nav-link', { active: pathname === '/companies' })} prefetch>
                        Công ty
                    </Link>
                    <Link
                        href="/AI/automatic_search/CV"
                        className={cx('nav-link', { active: pathname === '/AI/automatic_search/CV' })}
                        prefetch
                    >
                        Công cụ AI
                    </Link>
                </nav>

                <div className={cx('button-control')}>
                    {accessToken && user ? (
                        <div className={cx('user-info')}>
                            <Link href="/Auth/User/tong_quan_tai_khoan" prefetch>
                                <div className={styles.avatar_image}>
                                    {user && (
                                        <img
                                            src={
                                                user.image && user.image.trim() !== ''
                                                    ? `${apiUrl}${user.image}`
                                                    : '/images/user/user_default.png'
                                            }
                                            alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
                                            width="200"
                                        />
                                    )}
                                </div>
                            </Link>
                            <Link href="/Auth/User/tong_quan_tai_khoan" prefetch>
                                <span className={cx('user-name')}>
                                    {user.firstName} {user.lastName}
                                </span>
                            </Link>
                            <button className={cx('btn-logout')} onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <>
                            <button className={styles.btn_login} onClick={() => setIsLoginModalOpen(true)}>
                                Đăng nhập
                            </button>
                            <LoginModal
                                isOpen={isLoginModalOpen}
                                onClose={() => setIsLoginModalOpen(false)}
                                onLoginSuccess={handleLoginSuccess}
                            />
                            <button className={cx('btn-register')} onClick={() => router.push('/Auth/Register')}>
                                Đăng ký
                            </button>
                        </>
                    )}

                    <div className={cx('employer')}>
                        <span className={cx('header-question-employer')}>Bạn là nhà tuyển dụng?</span>
                        <Link href="/companies" className={cx('Apply-Now')} prefetch>
                            Đăng tuyển ngay
                            <FontAwesomeIcon icon={faChevronRight} />
                            <FontAwesomeIcon icon={faChevronRight} />
                        </Link>
                    </div>
                </div>

                <div className={cx('menu-icon')} onClick={toggleDrawer}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
            </header>

            <div className={cx('side-drawer', { open: isDrawerOpen })}>
                <div className={cx('side-drawer-header')}>
                    <HiOutlineXMark className={cx('close-icon')} onClick={toggleDrawer} />
                </div>
                <div className={cx('side-drawer-content')}>
                    <div className={cx('auth-buttons')}>
                        {accessToken && user ? (
                            <>
                                <Link href="/Auth/User/tong_quan_tai_khoan" prefetch>
                                    {user.firstName} {user.lastName}
                                </Link>
                                <button onClick={handleLogout}>Đăng xuất</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsLoginModalOpen(true)}>Đăng nhập</button>
                                <LoginModal
                                    isOpen={isLoginModalOpen}
                                    onClose={() => setIsLoginModalOpen(false)}
                                    onLoginSuccess={handleLoginSuccess}
                                />
                                <button className={cx('btn-register')} onClick={() => router.push('/Auth/Register')}>
                                    Đăng ký
                                </button>
                            </>
                        )}
                    </div>

                    <div className={cx('nav-links')}>
                        <Link href="/" className={cx({ active: pathname === '/' })} prefetch>
                            Trang chủ
                        </Link>
                        <Link href="/jobs" className={cx({ active: pathname === '/jobs' })} prefetch>
                            Việc làm
                        </Link>
                        <Link href="/companies" className={cx({ active: pathname === '/companies' })} prefetch>
                            Công ty
                        </Link>
                        <Link
                            href="/AI/automatic_search/CV"
                            className={cx({ active: pathname === '/AI/automatic_search/CV' })}
                            prefetch
                        >
                            Công cụ
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
