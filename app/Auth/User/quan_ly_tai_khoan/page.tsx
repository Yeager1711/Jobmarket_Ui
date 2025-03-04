'use client';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faHouse,
    faSchool,
    faGraduationCap,
    faPhone,
    faChevronDown,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import styles from './account_management.module.scss';
import UserControl from '../userControl/UserControl';
import { useApi } from '../../../Context/ApiContext/ApiContext';
import { User } from '../../../interface/User';
import { showToastError } from 'app/Ultils/toast';
import UpdateProfileModal from '../popup/updateProfie/page';
import AccountSettingsModal from '../popup/accountSettingsModal/page';
import ChangePassword from '../popup/ChangePassword/page'; // Import modal ChangePassword

function Profile() {
    const { fetchUser, updateEmail, changePassword } = useApi(); // Lấy changePassword từ useApi
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
    const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); // State để hiển thị modal đổi mật khẩu

    // Tải thông tin người dùng từ API /users/me
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            const userData = await fetchUser();
            setUser(userData);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu user:', error);
            showToastError('Không thể tải thông tin người dùng');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [fetchUser]);

    // Gọi fetchUserData khi component mount
    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            fetchUserData();
        } else {
            setLoading(false);
            setUser(null);
        }
    }, [fetchUserData]);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (!user) {
        return <div>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.</div>;
    }

    // Chuyển profileCompletion từ string (VD: "100%") thành number
    const profileCompletion = parseInt(user.profileCompletion) || 0;

    return (
        <section className={styles.account_management}>
            <div className={styles.wapper}>
                <UserControl />

                <div className={styles.account_management__details}>
                    <div className={styles.account_management__header}>
                        <h2>Quản lý tài khoản</h2>
                    </div>

                    <div className={styles.account_management__MainContent}>
                        <h3>Email đăng nhập & mật khẩu</h3>

                        <span className={styles.Email_access__text}>
                            Email truy cập hiện tại: <p>{user.email}</p>
                        </span>

                        <div className={styles.flex_control_button}>
                            <div className={styles.span_text}>
                                <span onClick={() => setIsAccountSettingsOpen(true)}>Thiết lập tài khoản</span>
                                <span onClick={() => setIsChangePasswordOpen(true)}>Thay đổi mật khẩu</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.Permanently_delete_account}>
                        <h3>Xóa vĩnh viễn tài khoản</h3>

                        <span>
                            Bạn có thể xóa vĩnh viễn tài khoản của mình <p>tại đây</p>!
                        </span>
                    </div>
                </div>
            </div>

            <AccountSettingsModal
                isOpen={isAccountSettingsOpen}
                onClose={() => setIsAccountSettingsOpen(false)}
                currentEmail={user.email}
                onSave={(newEmail: string, currentPassword: string) => {
                    return updateEmail(newEmail, currentPassword).then(() => {
                        setUser((prev) => (prev ? { ...prev, email: newEmail } : null));
                    });
                }}
            />
            <ChangePassword
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
                onChangePassword={(currentPassword: string, newPassword: string) => {
                    return changePassword(currentPassword, newPassword);
                }}
            />
            <UpdateProfileModal isOpen={isUpdateProfileOpen} onClose={() => setIsUpdateProfileOpen(false)} />
        </section>
    );
}

export default Profile;