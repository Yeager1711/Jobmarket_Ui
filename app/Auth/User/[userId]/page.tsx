'use client';
import { useState, useEffect } from 'react';
import type { User } from '../../../interface/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'next/navigation';
import styles from './User.module.scss';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { jwtDecode } from 'jwt-decode';
import type { ResumeCV } from '../../../interface/resume-cv.interface';
import PdfViewerModal from '../../../pages/DefaultLayouts/Popup/PdfViewerModal/pagge';
import ModelUploadCV from '../popup/uploadCV/page';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function User() {
    const [isUploadCVOpen, setIsUploadCVOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const { userId } = useParams();
    const [cvList, setCvList] = useState<ResumeCV[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
            const decoded: any = jwtDecode(token);
            const userIdFromToken = decoded.userId;

            const fetchCVs = async () => {
                try {
                    const response = await fetch(`${apiUrl}/users/getCv/${userIdFromToken}`);
                    if (!response.ok) throw new Error('Không thể lấy danh sách CV');

                    const data: ResumeCV[] = await response.json();
                    setCvList(data);
                } catch (error: any) {
                    console.error('Lỗi khi lấy danh sách CV:', error);
                }
            };

            fetchCVs();
        } catch (error) {
            console.error('Lỗi khi giải mã token:', error);
        }
    }, []);

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

    // Dữ liệu mẫu cho biểu đồ
    const appliedJobsData = [
        { month: '02/2024', applications: 5 },
        { month: '03/2024', applications: 8 },
        { month: '04/2024', applications: 6 },
        { month: '05/2024', applications: 12 },
        { month: '06/2024', applications: 9 },
        { month: '07/2024', applications: 15 },
        { month: '08/2024', applications: 7 },
        { month: '09/2024', applications: 10 },
        { month: '10/2024', applications: 13 },
        { month: '11/2024', applications: 11 },
        { month: '12/2024', applications: 14 },
        { month: '01/2025', applications: 16 },
        { month: '02/2025', applications: 18 },
    ];

    return (
        <section className={styles.user}>
            <div className={styles.wapper}>
                <div className={styles.user_control}>
                    <div className={styles.user_infomation}>
                        {user ? (
                            <>
                                <div className={styles.image_user}>
                                    <img src={`data:image/png;base64,${user.image}`} alt="User Avatar" />
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
                        <a href="">Tổng quan</a>
                        <a href="">Hồ sơ của tôi</a>
                        <a href="">Việc làm của tôi</a>
                        <a href="">Quản lý tài khoản</a>
                    </div>
                </div>

                <div className={styles.control_detail}>
                    <div className={styles.control_detail}>
                        <div className={styles.overview_header}>
                            <h3>Tổng quan Tài khoản</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div className={styles.flex_overview}>
                                    <span>
                                        Cập nhật hồ sơ của bạn để tìm hiểu thêm về con đường sự nghiệp tiếp theo của
                                        bạn.
                                    </span>
                                    <span>Mức độ hoàn thành hồ sơ của bạn: 10%</span>
                                </div>

                                <div className={styles.btn_updateProfile}>Cập nhật hồ sơ</div>
                            </div>
                        </div>
                        <div className={styles.resume}>
                            <h4>Hồ sơ CV của bạn</h4>
                            <div className={styles.box_resume}>
                                <div className={styles.box_resume__question}>
                                    <span>Bạn đã có CV?</span>
                                    <p>Tải lên CV để có thể ứng tuyển nhanh chóng</p>
                                </div>
                                {/* Khi bấm vào đây, modal sẽ hiển thị */}
                                <div className={styles.btn_resume_upload} onClick={() => setIsUploadCVOpen(true)}>
                                    Tải CV lên
                                </div>
                            </div>

                            <div className={styles.CV_Uploaded}>
                                {cvList.length > 0 ? (
                                    <>
                                        <h4>CV đã tải lên</h4>

                                        <div>
                                            {cvList.map((cv) => (
                                                <div key={cv.resumeCVId}>
                                                    <div className={styles.fileInfo}>
                                                        <FontAwesomeIcon icon={faPaperclip} />
                                                        <a
                                                            href={`data:application/pdf;base64,${cv.CV_img}`}
                                                            download={cv.name_file}
                                                        >
                                                            <span>{cv.name_file}</span>
                                                        </a>
                                                        <p>
                                                            Cập nhật lần cuối:{' '}
                                                            {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
                                                        </p>

                                                        <button
                                                            onClick={() => setPdfUrl(`${apiUrl}${cv.CV_img}`)}
                                                            className={styles.text_view}
                                                        >
                                                            Xem như nhà ứng tuyển
                                                        </button>
                                                        {pdfUrl && <PdfViewerModal pdfUrl={pdfUrl} onClose={() => setPdfUrl(null)} />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>

                        <div className={styles.overview_activity}>
                            <h4>Hoạt động của bạn</h4>
                            <div className={styles.overview_activity__container}>
                                <div className={styles.recorded_data}>
                                    <div className={styles.wapper_data}>
                                        <span className={styles.total}>18</span>
                                        <span className={styles.title}>Việc làm đã ứng tuyển</span>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>

                                    <div className={styles.wapper_data}>
                                        <span className={styles.total}>200</span>
                                        <span className={styles.title}>Việc làm phù hợp</span>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                </div>

                                <div className={styles.chart_line}>
                                    <h4>Thống kê việc làm đã ứng tuyển (1 năm qua)</h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={appliedJobsData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="applications"
                                                stroke="#8884d8"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Upload CV */}
            <ModelUploadCV isOpen={isUploadCVOpen} onClose={() => setIsUploadCVOpen(false)} name="Tên CV" />
        </section>
    );
}

export default User;
