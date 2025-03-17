// Account_OverView.tsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { User } from '../../../interface/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPaperclip, faEllipsis, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'next/navigation';
import styles from './User.module.scss';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { jwtDecode } from 'jwt-decode';
import type { ResumeCV } from '../../../interface/resume-cv.interface';
import PdfViewerModal from '../popup/PdfViewerModal/page';
import ModelUploadCV from '../popup/uploadCV/page';
import UserControl from '../userControl/UserControl';
import UpdateProfileModal from '../popup/updateProfie/page';
import AccountOverView_Skeleton from './AccountOverView_Skeleton';
import { useApi } from '../../../Context/ApiContext/ApiContext';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function Account_OverView() {
    const [isUploadCVOpen, setIsUploadCVOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [cvList, setCvList] = useState<ResumeCV[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [defaultCVId, setDefaultCVId] = useState<number | null>(null);
    const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const userId = params?.userId as string;

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { fetchUser, fetchCVs, setDefaultCV, deleteCV, isReady } = useApi();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                // setError('Vui lòng đăng nhập để xem thông tin');
                setLoading(false);
                return;
            }

            try {
                const decoded: any = jwtDecode(accessToken);
                const userIdFromToken = decoded.userId;

                const [userData, cvData] = await Promise.all([
                    fetchUser().catch((err) => {
                        throw new Error('Lỗi khi tải thông tin người dùng: ' + err.message);
                    }),
                    fetchCVs(userIdFromToken).catch((err) => {
                        throw new Error('Lỗi khi tải CV: ' + err.message);
                    }),
                ]);

                setUser(userData);
                setCvList(cvData);
                const defaultCV = cvData.find((cv: ResumeCV) => cv.isDefault);
                setDefaultCVId(defaultCV ? defaultCV.resumeCVId : null);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
                console.error(err);
                setLoading(false);
            }
        };

        // Chỉ gọi loadData khi isReady là true
        if (isReady) {
            loadData();
        }
    }, [fetchUser, fetchCVs, isReady]);

    const handleSetDefaultCV = useCallback(
        async (resumeCVId: number) => {
            try {
                const success = await setDefaultCV(resumeCVId);
                if (success) {
                    setDefaultCVId(resumeCVId);
                    setCvList((prev) =>
                        prev.map((cv) => ({
                            ...cv,
                            isDefault: cv.resumeCVId === resumeCVId ? 1 : 0,
                        }))
                    );
                }
            } catch (error) {
                console.error('Lỗi khi đặt CV mặc định:', error);
            }
        },
        [setDefaultCV]
    );

    const handleDeleteCV = useCallback(
        async (resumeCVId: number) => {
            const confirmed = window.confirm('Bạn có muốn xóa CV này không?');
            if (!confirmed) return;

            try {
                const success = await deleteCV(resumeCVId);
                if (success) {
                    setCvList((prev) => prev.filter((cv) => cv.resumeCVId !== resumeCVId));
                    if (defaultCVId === resumeCVId) setDefaultCVId(null);
                }
            } catch (error) {
                console.error('Lỗi khi xóa CV:', error);
            }
        },
        [deleteCV, defaultCVId]
    );

    const handleViewPdf = (cvImg: string) => {
        let fullPdfUrl = cvImg;
        if (!cvImg.startsWith('data:application/pdf;base64,')) {
            fullPdfUrl = `${apiUrl}${cvImg.startsWith('/') ? '' : '/'}${cvImg}`;
        }
        setPdfUrl(fullPdfUrl);
    };

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

    if (loading) return <AccountOverView_Skeleton />;
    if (error) return <div>{error}</div>;

    return (
        <section className={styles.user + ' marTop'}>
            <div className={styles.wapper}>
                <UserControl />
                <UpdateProfileModal
                    isOpen={isUpdateProfileOpen}
                    onClose={() => setIsUpdateProfileOpen(false)}
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                />

                <div className={styles.control_detail}>
                    <div className={styles.control_detail}>
                        <div className={styles.overview_header}>
                            <h3>Tổng quan Tài khoản</h3>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div className={styles.flex_overview}>
                                    <span>
                                        Cập nhật hồ sơ của bạn để tìm hiểu thêm về con đường sự nghiệp tiếp theo của bạn.
                                    </span>
                                    {user && (
                                        <span className={styles.profileCompletion}>
                                            Mức độ hoàn thành hồ sơ của bạn: <p>{`${user.profileCompletion}`}</p>
                                        </span>
                                    )}
                                </div>
                                <div className={styles.btn_updateProfile} onClick={() => setIsUpdateProfileOpen(true)}>
                                    Cập nhật hồ sơ
                                </div>
                            </div>
                        </div>
                        <div className={styles.resume}>
                            <h4>Hồ sơ CV của bạn</h4>
                            <div className={styles.box_resume}>
                                <div className={styles.box_resume__question}>
                                    <span>Bạn đã có CV?</span>
                                    {cvList.length === 0 ? (
                                        <p>Tải lên CV để có thể ứng tuyển nhanh chóng.</p>
                                    ) : (
                                        <p>Lựa chọn CV phù hợp nhất với công việc bạn mong muốn.</p>
                                    )}
                                </div>
                                <div className={styles.btn_resume_upload} onClick={() => setIsUploadCVOpen(true)}>
                                    Tải CV lên
                                </div>
                            </div>

                            <div className={styles.CV_Uploaded}>
                                {cvList.length > 0 && (
                                    <>
                                        <h4>CV đã tải lên</h4>
                                        <div>
                                            {cvList.map((cv) => (
                                                <div key={cv.resumeCVId}>
                                                    <div className={styles.fileInfo}>
                                                        {cv.isDefault ? (
                                                            <div className={styles.setDefault_isDefault}>
                                                                CV mặc định
                                                            </div>
                                                        ) : (
                                                            <div className={styles.setDefault}>
                                                                <input
                                                                    type="radio"
                                                                    checked={defaultCVId === cv.resumeCVId}
                                                                    onChange={() => handleSetDefaultCV(cv.resumeCVId)}
                                                                />
                                                                Đặt làm mặc định
                                                            </div>
                                                        )}
                                                        <div
                                                            className={styles.btn_controll}
                                                            onClick={() => handleDeleteCV(cv.resumeCVId)}
                                                        >
                                                            <FontAwesomeIcon icon={faEllipsis} />
                                                        </div>
                                                        <FontAwesomeIcon icon={faPaperclip} />
                                                        <a
                                                            href={
                                                                cv.CV_img.startsWith('data:application/pdf;base64,')
                                                                    ? cv.CV_img
                                                                    : `${apiUrl}${cv.CV_img.startsWith('/') ? '' : '/'}${cv.CV_img}`
                                                            }
                                                            download={cv.name_file}
                                                        >
                                                            <span>{cv.name_file}</span>
                                                        </a>
                                                        <p>
                                                            Cập nhật lần cuối:{' '}
                                                            {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
                                                        </p>
                                                        <button
                                                            onClick={() => handleViewPdf(cv.CV_img)}
                                                            className={styles.text_view}
                                                        >
                                                            Xem như nhà ứng tuyển
                                                        </button>
                                                        {pdfUrl && (
                                                            <PdfViewerModal
                                                                pdfUrl={pdfUrl}
                                                                onClose={() => setPdfUrl(null)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles.overview_activity}>
                            <h4>Hoạt động của bạn</h4>
                            <div className={styles.overview_activity__container}>
                                <div className={styles.recorded_data}>
                                    <div className={styles.wapper_data}>
                                        <span className={styles.total}>0</span>
                                        <span className={styles.title}>Việc làm đã ứng tuyển</span>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                    <div className={styles.wapper_data}>
                                        <span className={styles.total}>200</span>
                                        <span className={styles.title}>Được lọc ra phù hợp với CV của bạn</span>
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
            <ModelUploadCV isOpen={isUploadCVOpen} onClose={() => setIsUploadCVOpen(false)} name="Tên CV" />
        </section>
    );
}

export default Account_OverView;