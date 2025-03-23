'use client';
import styles from './checkout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useApi } from '../../../Context/ApiContext/ApiContext';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';

// Hàm định dạng tiền tệ VND
const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

// Interface cho CV
interface CV {
    resumeCVId: number;
    name_file?: string;
    isDefault: boolean;
    updatedAt: string;
}

export default function Checkout() {
    const [isProcessing, setIsProcessing] = useState(false);
    const searchParams = useSearchParams();
    const { accessToken, fetchUser, fetchCVs, fetchJobDetails } = useApi();
    const router = useRouter();

    // Lấy jobId và resumeCVId từ query parameter
    const jobId = searchParams.get('jobId') ? parseInt(searchParams.get('jobId') as string) : 0;
    const resumeCVId = searchParams.get('resumeCVId') ? parseInt(searchParams.get('resumeCVId') as string) : 0;

    const [user, setUser] = useState<any | null>(null);
    const [cvs, setCvs] = useState<CV[]>([]);
    const [jobDetails, setJobDetails] = useState<any | null>(null);
    const [selectedCV, setSelectedCV] = useState<CV | null>(null);

    // Lấy thông tin người dùng, CV, và job khi component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Lấy thông tin người dùng
                const userData = await fetchUser();
                setUser(userData);

                // Lấy danh sách CV
                if (userData?.userId) {
                    const cvData = await fetchCVs(userData.userId);
                    setCvs(cvData);

                    // Chỉ chọn CV nếu resumeCVId được cung cấp
                    if (resumeCVId) {
                        const selected = cvData.find((cv: CV) => cv.resumeCVId === resumeCVId);
                        setSelectedCV(selected || null);
                    }
                }

                // Lấy thông tin job
                if (jobId) {
                    const jobData = await fetchJobDetails(jobId);
                    setJobDetails(jobData);
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
                toast.error('Có lỗi xảy ra khi tải dữ liệu', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };
        loadData();
    }, [accessToken, fetchUser, fetchCVs, fetchJobDetails, jobId, resumeCVId]);

    const handlePayment = async () => {
        if (!jobId || jobId === 0) {
            showToastError('Không tìm thấy jobId');
            return;
        }

        if (!selectedCV) {
            showToastError('Vui lòng chọn một CV để tiếp tục');
            return;
        }

        setIsProcessing(true);

        try {
            console.log('jobId gửi đi:', jobId);
            console.log('resumeCVId gửi đi:', selectedCV.resumeCVId);

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_APP_API_BASE_URL}/users/compare-competitiveness/${jobId}/${selectedCV.resumeCVId}`,
                {
                    resumeCVId: selectedCV.resumeCVId,
                },
                { headers }
            );

            showToastSuccess('Thanh toán và phân tích thành công!');
            router.push(
                `/Auth/User/chatAI/result/compareCompetitiveness?jobId=${jobId}&resumeCVId=${selectedCV.resumeCVId}`
            );
        } catch (error: any) {
            console.error('Lỗi khi gọi API:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi phân tích mức độ cạnh tranh', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Tính toán giá tiền
    const basePrice = parseInt(process.env.NEXT_PUBLIC_APP_PRICE_AI || '25000');
    const taxRate = 0.1; // 10% VAT
    const totalWithoutTax = Math.round(basePrice / (1 + taxRate));
    const totalWithTax = basePrice;

    return (
        <section className={styles.PaymentPage}>
            <h2 className={styles.paymentSection__title}>Thanh toán</h2>
            <p className={styles.paymentSection__text}>Thông tin thanh toán</p>

            <div className={styles.container}>
                <div className={styles.paymentSection}>
                    <div className={styles.orderInfo}>
                        <h3 className={styles.orderInfo__title}>Thông tin đơn hàng</h3>
                        <div className={styles.user_infomation}>
                            <span className={styles.user_infomation__item}>
                                {user?.firstName} {user?.lastName}
                            </span>
                            <span className={styles.user_infomation__item}>
                                Mã ứng viên: <p>#{user?.userId || 'N/A'}</p>
                            </span>
                            <span className={styles.user_infomation__item}>
                                <p>Email: </p>
                                {user?.email}
                            </span>
                            <span className={styles.user_infomation__item}>
                                <p style={{ marginRight: '.5rem' }}>Nội dung: </p>
                                "Thanh toán sử dụng dịch vụ phân tích hồ sơ xin việc bằng AI"
                            </span>
                        </div>
                        <div className={styles.orderDetails}>
                            <div className={styles.orderDetails__row}>
                                <span className={styles.orderDetails__cell}>Tên sản phẩm</span>
                                <span className={styles.orderDetails__cell}>Đơn giá (đồng)</span>
                                <span className={styles.orderDetails__cell}>Số lượng</span>
                                <span className={styles.orderDetails__cell}>Tổng cộng (đồng)</span>
                            </div>
                            <div className={styles.orderDetails__row}>
                                <span className={styles.orderDetails__cell}>
                                    Báo Cáo Phân Tích Mức Độ Cạnh Tranh Phần Cứng CV{' '}
                                    <p>
                                        {selectedCV?.name_file || 'Chưa chọn CV'} (ID: {selectedCV?.resumeCVId || 'N/A'}
                                        )
                                    </p>
                                    <p>
                                        Vị trí: {jobDetails?.title || 'Chưa tải job'} (ID: {jobId})
                                    </p>
                                </span>
                                <span className={styles.orderDetails__cell__item}>{formatVND(totalWithoutTax)}</span>
                                <span className={styles.orderDetails__cell__item}>1</span>
                                <span className={styles.orderDetails__cell__item}>{formatVND(totalWithoutTax)}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.contactInfo}>
                        <h3 className={styles.contactInfo__title}>Liên hệ với chúng tôi:</h3>
                        <div className={styles.flex_contact}>
                            <p className={styles.contactInfo__item}>
                                <FontAwesomeIcon icon={faPhone} /> (84) 333xxxx92
                            </p>
                            <p className={styles.contactInfo__item}>
                                <FontAwesomeIcon icon={faEnvelope} />
                                Email:{' '}
                                <a href="mailto:contact@vietnamworks.com" className={styles.contactInfo__link}>
                                    contact@jobmarket.com.vn
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.summarySection}>
                    <h3 className={styles.summarySection__title}>Thông tin thanh toán</h3>
                    <div className={styles.summaryDetails}>
                        <div className={styles.summaryDetails__row}>
                            <span>
                                Tổng cộng <p>(Chưa bao gồm thuế)</p>
                            </span>
                            <span className={styles.summaryDetails__price}>{formatVND(totalWithoutTax)}</span>
                        </div>
                        <div className={styles.summaryDetails__row}>
                            <span>
                                Số tiền thanh toán <p>(Đã bao gồm 10% VAT)</p>
                            </span>
                            <span className={styles.summaryDetails__price__final}>{formatVND(totalWithTax)}</span>
                        </div>
                        <div className={styles.summaryDetails__row}>
                            <input type="checkbox" id="vatInfo" className={styles.summaryDetails__checkbox} />
                            <label htmlFor="vatInfo" className={styles.summaryDetails__label}>
                                Tôi đồng ý với{' '}
                                <a href="#" className={styles.summaryDetails__link}>
                                    Thông tin sử dụng, Quy định bảo mật
                                </a>{' '}
                                và{' '}
                                <a href="#" className={styles.summaryDetails__link}>
                                    Chính sách hoàn tiền
                                </a>{' '}
                                của JobMarket.
                            </label>
                        </div>
                    </div>
                    <button
                        className={`${styles.proceedButton} ${isProcessing ? styles.processing : ''}`}
                        onClick={handlePayment}
                        disabled={isProcessing || !selectedCV}
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
                    </button>
                </div>
            </div>
        </section>
    );
}
