'use client';
import { useState, useEffect, useRef } from 'react';
import type { User } from '../../../../interface/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPaperclip, faEllipsis, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'next/navigation';
import styles from './User.module.scss';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { jwtDecode } from 'jwt-decode';
import type { ResumeCV } from '../../../../interface/resume-cv.interface';
import PdfViewerModal from '../../popup/PdfViewerModal/page';
import ModelUploadCV from '../../popup/uploadCV/page';
import axios from 'axios';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';
const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
import UserControl from '../userControl/UserControl';

import UpdateProfileModal from '../../popup/updateProfie/page';
import { headers } from 'next/headers';

function User() {
    const [isUploadCVOpen, setIsUploadCVOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [cvList, setCvList] = useState<ResumeCV[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [defaultCVId, setDefaultCVId] = useState<number | null>(null);
    const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [cvToDelete, setCvToDelete] = useState<number | null>(null);

    const params = useParams();
    const userId = params?.userId;

    // Image
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPrivew] = useState<string | null>(null);

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) return;

        try {
            const decoded: any = jwtDecode(access_token);
            const userIdFromToken = decoded.userId;

            const fetchCVs = async () => {
                try {
                    const response = await fetch(`${apiUrl}/users/getCv/${userIdFromToken}`);
                    if (!response.ok) throw new Error('Không thể lấy danh sách CV');

                    const data: ResumeCV[] = await response.json();
                    setCvList(data);

                    // Tìm CV mặc định
                    const defaultCV = data.find((cv) => cv.isDefault);

                    if (defaultCV) {
                        setDefaultCVId(defaultCV.resumeCVId);
                    } else {
                        setDefaultCVId(null); // Reset nếu không có CV mặc định
                    }
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

    const handleSetDefaultCV = async (resumeCVId: number) => {
        console.log('🚀 Gọi handleSetDefaultCV với cvId:', resumeCVId);
        setDefaultCVId(resumeCVId);

        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            console.warn('⚠️ Không tìm thấy token, hủy request.');
            showToastError('Không tìm thấy token');
            return;
        }

        try {
            const apiEndpoint = `${apiUrl}/users/setDefaultCV/${resumeCVId}`;
            console.log('🔗 Gửi request đến API:', apiEndpoint);

            const response = await fetch(apiEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Cập nhật CV mặc định thành công', data);

            // Cập nhật cvList: Đặt isDefault cho CV mới và bỏ isDefault cho CV cũ
            setCvList((prevCvList) =>
                prevCvList.map((cv) => ({
                    ...cv,
                    isDefault: cv.resumeCVId === resumeCVId ? 1 : 0,
                }))
            );

            showToastSuccess(data.message);
        } catch (error: any) {
            console.error('🚨 Lỗi khi cập nhật CV mặc định:', error.message);
            showToastError(error.message || 'Lỗi khi đặt CV mặc định');
        }
    };

    //Hàm xử lý xóa CV
    const handleDeleteCV = async (resumeCVId: number) => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            showToastError('Tokens not found');
            return;
        }

        //Sử dụng confirm
        const confirmed = window.confirm('Bạn có muốn xóa Cv này không ? ');
        if (!confirmed) return;

        try {
            const response = await fetch(`${apiUrl}/users/deleteCV/${resumeCVId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                credentials: 'include',
            });

            if (response.status === 200) {
                setCvList(cvList.filter((cv) => cv.resumeCVId !== resumeCVId));
                if (defaultCVId === resumeCVId) setDefaultCVId(null);
                showToastSuccess('Xóa CV thành công');
            }
        } catch (error) {
            console.error('Lỗi khi xóa CV:', error);
            showToastError('Xóa CV thất bại');
        }
    };
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
                <UserControl />
                <UpdateProfileModal isOpen={isUpdateProfileOpen} onClose={() => setIsUpdateProfileOpen(false)} />

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
                                        Cập nhật hồ sơ của bạn để tìm hiểu thêm về con đường sự nghiệp tiếp theo của
                                        bạn.
                                    </span>

                                    {user ? (
                                        <span className={styles.profileCompletion}>
                                            Mức độ hoàn thành hồ sơ của bạn:
                                            <p>{`${user.profileCompletion}`}</p>
                                        </span>
                                    ) : (
                                        <span>Loading</span>
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
                                                        {cv.isDefault ? (
                                                            <div className={styles.setDefault_isDefault}>
                                                                CV mặc định
                                                            </div>
                                                        ) : (
                                                            <div className={styles.setDefault}>
                                                                <input
                                                                    type="radio"
                                                                    checked={defaultCVId === Number(cv.resumeCVId)}
                                                                    onChange={() => handleSetDefaultCV(cv.resumeCVId)}
                                                                />
                                                                Mặc định
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
                                        <span className={styles.total}>0</span>
                                        <span className={styles.title}>Việc làm đã ứng tuyển</span>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>

                                    <div className={styles.wapper_data}>
                                        <span className={styles.total}>200</span>
                                        <span className={styles.title}>Được AI lọc ra phù hợp với CV của bạn</span>
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
