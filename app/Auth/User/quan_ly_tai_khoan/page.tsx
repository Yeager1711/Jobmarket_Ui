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
import { showToastError, showToastSuccess } from 'app/Ultils/toast';
import UpdateProfileModal from '../popup/updateProfie/page';
import AccountSettingsModal from '../popup/accountSettingsModal/page';
import ChangePassword from '../popup/ChangePassword/page';
import DeleteAccountModal from '../popup/DeleteAccount/Question/page';
import { useRouter } from 'next/navigation';


function Profile() {
    const { fetchUser, updateEmail, changePassword, isReady, accessToken, deleteAccountCurrent } = useApi();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
    const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
    const router = useRouter();

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            const userData = await fetchUser();
            setUser(userData);
        } catch (error: any) {
            console.error('Lỗi khi lấy dữ liệu user:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            showToastError(
                error.response?.data?.message || 'Không thể tải thông tin người dùng do lỗi không xác định'
            );
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [fetchUser]);

    useEffect(() => {
        if (isReady && accessToken) {
            fetchUserData();
        } else if (!accessToken) {
            setLoading(false);
            setUser(null);
            // showToastError('Vui lòng đăng nhập để xem thông tin');
            router.push('/');
        }
    }, [fetchUserData, isReady, accessToken]);

    const handleDeleteAccount = useCallback(async () => {
        setIsDeleteAccountOpen(true);
    }, []);

    const handleConfirmDeleteAccount = useCallback(async () => {
        if (deleteAccountCurrent) {
            const success = await deleteAccountCurrent();
            if (success) {
                showToastSuccess('Tài khoản đã được xóa thành công');
                // Không cần setUser(null) vì redirect sẽ xử lý
            } else {
                showToastError('Xóa tài khoản thất bại');
            }
            setIsDeleteAccountOpen(false);
        }
    }, [deleteAccountCurrent]);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (!user) {
        return <div>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.</div>;
    }

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
                            Bạn có thể xóa vĩnh viễn tài khoản của mình
                            <p
                                onClick={handleDeleteAccount}
                                style={{ color: '#007bff', cursor: 'pointer' }}
                            >
                                tại đây
                            </p>
                            !
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
                        showToastSuccess('Cập nhật email thành công');
                        setUser((prev) => (prev ? { ...prev, email: newEmail } : null));
                        fetchUserData(); // Cập nhật lại dữ liệu user
                    });
                }}
            />
            <ChangePassword
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
                onChangePassword={(currentPassword: string, newPassword: string) => {
                    return changePassword(currentPassword, newPassword).then(() => {
                        showToastSuccess('Đổi mật khẩu thành công');
                    });
                }}
            />
            <UpdateProfileModal
                isOpen={isUpdateProfileOpen}
                onClose={() => setIsUpdateProfileOpen(false)}
            />
            <DeleteAccountModal
                isOpen={isDeleteAccountOpen}
                onClose={() => setIsDeleteAccountOpen(false)}
                firstName={user.firstName}
                lastName={user.lastName}
                onConfirm={handleConfirmDeleteAccount} // Kết nối với hàm xử lý xóa tài khoản
            />
        </section>
    );
}

export default Profile;