'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { HiOutlineXMark } from 'react-icons/hi2';
import styles from './header.module.scss';

import LoginModal from '../../../Auth/Login/Modal/page';
const cx = classNames.bind(styles);

interface DecodedToken {
    userId: number;
    firstName: string;
    lastName: string;
    image: string;
}

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function Header() {
    const pathname = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [user, setUser] = useState<DecodedToken | null>(null);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    const router = useRouter();

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        console.log('acces_token', access_token);

        if (access_token) {
            try {
                const decoded = jwtDecode<DecodedToken>(access_token);
                setUser({
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    image: decoded.image,
                    userId: decoded.userId,
                });
                console.log('decoded:  ', decoded);
            } catch (error) {
                console.error('Lỗi khi giải mã JWT:', error);
            }
        }
    }, [location, localStorage.getItem('access_token')]);

    const handleLogout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/');
    };

    const handleRegisterClick = () => {
        router.push('/Auth/Register');
    };

    return (
        <>
            <header className={cx('header_wrapper')}>
                <a href="/" className={cx('logo')}>
                    <img src="/logo/logo_website.png" alt="Logo" />
                </a>

                <nav className={cx('navbar', { open: isMenuOpen })}>
                    <Link href="/" className={cx('nav-link', { active: pathname === '/' })}>
                        Trang chủ
                    </Link>
                    <Link href="/jobs" className={cx('nav-link', { active: pathname === '/jobs' })}>
                        Việc làm
                    </Link>
                    <Link href="/companies" className={cx('nav-link', { active: pathname === '/companies' })}>
                        Công ty
                    </Link>

                    <Link
                        href="/AI/automatic_search/CV"
                        className={cx('nav-link', { active: pathname === '/AI/automatic_search/CV' })}
                    >
                        Công cụ AI
                    </Link>
                </nav>

                <div className={cx('button-control')}>
                    {user ? (
                        <div className={cx('user-info')}>
                            <div
                                className={styles.avatar_image}
                                onClick={() => {
                                    router.push(`/Auth/User/${user.userId}/tong_quan_tai_khoan`);
                                }}
                            >
                                <img
                                    src={
                                        user.image
                                            ? `${apiUrl}${user.image}`
                                            : '/images/user/user_default.png'
                                    }
                                    alt=""
                                    width="200"
                                />
                            </div>
                            <span
                                className={cx('user-name')}
                                onClick={() => {
                                    router.push(`/Auth/User/${user.userId}/tong_quan_tai_khoan`);
                                }}
                            >
                                {user.firstName} {user.lastName}
                            </span>
                            <button className={cx('btn-logout')} onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <>
                            <button className={styles.btn_login} onClick={() => setIsLoginModalOpen(true)}>
                                Đăng nhập
                            </button>
                            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

                            <button className={cx('btn-register')} onClick={() => router.push('/Auth/Register')}>
                                Đăng ký
                            </button>
                        </>
                    )}

                    <div className={cx('employer')}>
                        <span className={cx('header-question-employer')}>Bạn là nhà tuyển dụng?</span>
                        <Link href="/companies" className={cx('Apply-Now')}>
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

            {/* Side Drawer */}
            <div className={cx('side-drawer', { open: isDrawerOpen })}>
                <div className={cx('side-drawer-header')}>
                    <HiOutlineXMark className={cx('close-icon')} onClick={toggleDrawer} />
                </div>
                <div className={cx('side-drawer-content')}>
                    {/* Auth Buttons */}
                    <div className={cx('auth-buttons')}>
                        <>
                            <button onClick={() => setIsLoginModalOpen(true)}>Đăng nhập</button>
                            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
                        </>
                        <button className={cx('btn-register')}>Đăng ký</button>
                    </div>

                    {/* Navigation Links */}
                    <div className={cx('nav-links')}>
                        <Link href="/" className={cx({ active: pathname === '/' })}>
                            Trang chủ
                        </Link>
                        <Link href="/jobs" className={cx({ active: pathname === '/jobs' })}>
                            Việc làm
                        </Link>
                        <Link href="/companies" className={cx({ active: pathname === '/companies' })}>
                            Công ty
                        </Link>

                        <div>Công cụ</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
