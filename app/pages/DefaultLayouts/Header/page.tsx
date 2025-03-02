'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { HiOutlineXMark } from 'react-icons/hi2';
import styles from './header.module.scss';
import LoginModal from '../../../Auth/Login/Modal/page';
import { useApi } from '../../../Context/ApiContext/ApiContext';
import { showToastError } from 'app/Ultils/toast';
import { User } from '../../../interface/User';

const cx = classNames.bind(styles);

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { fetchUser } = useApi();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [lastToken, setLastToken] = useState<string | null>(null); // Lưu giá trị access_token cuối cùng

    // Memoize toggleDrawer để tránh tạo lại hàm
    const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

    // Tải thông tin người dùng từ API /users/me
    const fetchUserData = useCallback(async () => {
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            try {
                const userData = await fetchUser();
                setUser(userData); // Lưu toàn bộ dữ liệu từ API vào state
                setLastToken(access_token); // Cập nhật token cuối cùng
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu user:', error);
                showToastError('Không thể tải thông tin người dùng');
                setUser(null);
                setLastToken(null);
            }
        } else {
            setUser(null);
            setLastToken(null);
        }
    }, [fetchUser]);

    // Gọi fetchUserData khi mount
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Lắng nghe sự thay đổi của access_token trong localStorage
    useEffect(() => {
        const checkTokenChange = () => {
            const currentToken = localStorage.getItem('access_token');
            if (currentToken !== lastToken) {
                fetchUserData(); // Gọi lại fetchUserData nếu token thay đổi
            }
        };

        // Kiểm tra token mỗi 1 giây
        const interval = setInterval(checkTokenChange, 1000);

        // Lắng nghe sự kiện storage (cho các tab khác)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'access_token') {
                fetchUserData(); // Gọi lại fetchUserData nếu token thay đổi ở tab khác
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Dọn dẹp khi component unmount
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchUserData, lastToken]);

    // Callback khi đăng nhập thành công
    const handleLoginSuccess = useCallback(() => {
        fetchUserData(); // Gọi lại fetchUserData để cập nhật thông tin user ngay lập tức
    }, [fetchUserData]);

    // Memoize handleLogout
    const handleLogout = useCallback(() => {
        localStorage.removeItem('access_token');
        setUser(null);
        setLastToken(null);
        router.push('/');
    }, [router]);

    if (pathname === '/Auth/Register') return null;

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
                    {user ? (
                        <div className={cx('user-info')}>
                            <Link href="/Auth/User/tong_quan_tai_khoan" prefetch>
                                <div className={styles.avatar_image}>
                                    <img
                                        src={user.image ? `${apiUrl}${user.image}` : '/images/user/user_default.png'}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        width="200"
                                    />
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
                        {user ? (
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