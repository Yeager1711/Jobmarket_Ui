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
import styles from './profile.module.scss';
import UserControl from '../userControl/UserControl';
import { useApi } from '../../../Context/ApiContext/ApiContext';
import { User } from '../../../interface/User';
import { showToastError } from 'app/Ultils/toast';
import UpdateProfileModal from '../popup/updateProfie/page';
import { PhoneNumber } from 'libphonenumber-js';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function Profile() {
    const { fetchUser } = useApi();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);

    // Hàm để xác định nhãn của thanh tiến trình dựa trên phần trăm
    const getProgressLabel = (percentage: number) => {
        if (percentage <= 10) return 'Thấp';
        if (percentage <= 25) return 'Cơ bản';
        if (percentage <= 50) return 'Trung bình';
        if (percentage <= 75) return 'Tương đối hoàn chỉnh';
        return 'Hoàn chỉnh';
    };

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

    // Định dạng số điện thoai
    const formatPhoneNumber = (phoneNumber: string) => {
        if (!phoneNumber || phoneNumber.trim() === '') return '';

        // Lấy mã quốc gia (VD: +84) và phần số còn lại
        const countryCode = phoneNumber.substring(0, 3); // +84
        const number = phoneNumber.substring(3); // 333409892

        return `${countryCode}-${number}`; // +84-333409892
    };
    
    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (!user) {
        return <div>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.</div>;
    }

    // Chuyển profileCompletion từ string (VD: "100%") thành number
    const profileCompletion = parseInt(user.profileCompletion) || 0;

    return (
        <section className={styles.account_overview}>
            <div className={styles.wapper}>
                <UserControl />

                <div className={styles.account_overview__details}>
                    <div className={styles.account_overview__header}>
                        <div className={styles.image_user}>
                            <img
                                src={user.image ? `${apiUrl}${user.image}` : '/images/user/user_default.png'}
                                alt={`${user.firstName} ${user.lastName}`}
                            />
                        </div>

                        <div className={styles.user_infomation}>
                            <h2>{`${user.firstName} ${user.lastName}`}</h2>
                            <div className={styles.years_of_experience}>{user.yearOfNumberExperience} kinh nghiệm</div>

                            <div className={styles.flex_info}>
                                <div className={styles.box_info}>
                                    <span className={styles.box_info__item}>
                                        <FontAwesomeIcon icon={faSchool} />
                                        Cấp bậc: <p>{user.experienceLevel}</p>
                                    </span>
                                    <span className={styles.box_info__item}>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                        Email: <p>{user.email}</p>
                                    </span>
                                    <span className={styles.box_info__item}>
                                        <FontAwesomeIcon icon={faHouse} />
                                        Địa chỉ: <p>{user.address}</p>
                                    </span>
                                </div>
                                <div className={styles.box_info}>
                                    <span className={styles.box_info__item}>
                                        <FontAwesomeIcon icon={faGraduationCap} />
                                        Bằng cấp: <p>{user.highestDegree}</p>
                                    </span>
                                    <span className={styles.box_info__item}>
                                        <FontAwesomeIcon icon={faPhone} /> Số điện thoại:{' '}
                                        <p>{user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : 'N/A'}</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.account_overview__MainContent}>
                        <h2>Công việc mong muốn</h2>

                        <div className={styles.box_mainContent}>
                            <span className={styles.mainContent_item}>
                                Vị trí mong muốn: <p>{user.jobTitle}</p>
                            </span>
                            <span className={styles.mainContent_item}>
                                Mức lương mong muốn (VNĐ/tháng):{' '}
                                <p>{new Intl.NumberFormat('vi-VN').format(user.expectedSalary)} VNĐ</p>
                            </span>
                        </div>
                    </div>

                    <div className={styles.Level_Profile__Complete}>
                        <h2>Mức Độ Hoàn Chỉnh Hồ Sơ</h2>
                        <div className={styles.progress_container}>
                            <div className={styles.progress_bar}>
                                <div className={styles.progress_fill} style={{ width: `${profileCompletion}%` }}>
                                    <span className={styles.progress_label}>
                                        <span>{user.profileCompletion}</span>
                                    </span>
                                </div>
                            </div>
                            <div className={styles.progress_milestones}>
                                <span>Cơ bản</span>
                                <span>Trung bình</span>
                                <span>Tương đối hoàn chỉnh</span>
                                <span>Hoàn chỉnh</span>
                            </div>
                        </div>
                        <div className={styles.progress_info}>
                            <span>
                                Điền vào những nội dung sau để tăng bậc hồ sơ <FontAwesomeIcon icon={faChevronDown} />
                            </span>
                        </div>
                        <div className={styles.progress_actions}>
                            <button className={styles.action_button}>Cập nhật hoàn thiện hồ sơ</button>
                        </div>
                    </div>

                    <div className={styles.box_infoBasic}>
                        <div className={styles.box_infoBasic__item}>
                            <h2>Vị trí mong muốn</h2>
                            {user.jobTitle ? (
                                <span>{user.jobTitle}</span>
                            ) : (
                                <>
                                    <span>Mô tả vị trí công việc bạn muốn hướng đến</span>
                                    <p onClick={() => setIsUpdateProfileOpen(true)}>
                                        {' '}
                                        <FontAwesomeIcon icon={faPlus} /> Thêm vị trí mong muốn
                                    </p>
                                </>
                            )}
                        </div>

                        <div className={styles.box_infoBasic__item}>
                            <h2>Mức lương mong muốn</h2>

                            {new Intl.NumberFormat('vi-VN').format(user.expectedSalary) ? (
                                <span>{new Intl.NumberFormat('vi-VN').format(user.expectedSalary)} VNĐ</span>
                            ) : (
                                <>
                                    <span>Thêm mức lương mong muốn</span>
                                    <p onClick={() => setIsUpdateProfileOpen(true)}>
                                        {' '}
                                        <FontAwesomeIcon icon={faPlus} /> Thêm mức lương mong muốn
                                    </p>
                                </>
                            )}
                        </div>

                        <div className={styles.box_infoBasic__item}>
                            <h2>Kỹ năng</h2>

                            {user.skills ? (
                                <span>{user.skills}</span>
                            ) : (
                                <>
                                    <span>hêm những kỹ năng mà bạn đã có trong suốt quá trình.</span>
                                    <p onClick={() => setIsUpdateProfileOpen(true)}>
                                        {' '}
                                        <FontAwesomeIcon icon={faPlus} /> Thêm kỹ năng đã có
                                    </p>
                                </>
                            )}
                        </div>

                        <div className={styles.box_infoBasic__item}>
                            <h2>Thông tin học vấn</h2>
                            {user.education ? (
                                <span>{user.education}</span>
                            ) : (
                                <>
                                    <span>Mô tả thông tin trường bạn đang hoặc đã từng học tại đó.</span>
                                    <p onClick={() => setIsUpdateProfileOpen(true)}>
                                        {' '}
                                        <FontAwesomeIcon icon={faPlus} /> Thêm thông tin học vấn tại nơi bạn đã trải qua
                                    </p>
                                </>
                            )}
                        </div>

                        <div className={styles.box_infoBasic__item}>
                            <h2>Bằng cấp cao nhất</h2>
                            {user.highestDegree ? (
                                <span>{user.highestDegree}</span>
                            ) : (
                                <>
                                    <span>
                                        Mô tả toàn bộ quá trình học vấn của bạn, cũng như các bằng cấp bạn đã được và
                                        các khóa huấn luyện bạn đã tham gia.
                                    </span>
                                    <p onClick={() => setIsUpdateProfileOpen(true)}>
                                        {' '}
                                        <FontAwesomeIcon icon={faPlus} /> Thêm thông tin bằng cấp bạn đã có được
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <UpdateProfileModal isOpen={isUpdateProfileOpen} onClose={() => setIsUpdateProfileOpen(false)} />
        </section>
    );
}

export default Profile;
