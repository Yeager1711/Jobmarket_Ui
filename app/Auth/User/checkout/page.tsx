'use client';
import styles from './checkout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useApi } from '../../../Context/ApiContext/ApiContext';

// Hàm định dạng tiền tệ VND
const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

export default function PaymentPage() {
    const [isProcessing, setIsProcessing] = useState(false);
    const searchParams = useSearchParams();
    const { accessToken, fetchUser, fetchCVs, fetchJobDetails } = useApi();
    const router = useRouter();

    // Lấy jobId từ query parameter
    const jobId = searchParams.get('jobId') ? parseInt(searchParams.get('jobId') as string) : 0;
    const [user, setUser] = useState<any | null>(null);
    const [cvs, setCvs] = useState<any[]>([]);
    const [jobDetails, setJobDetails] = useState<any | null>(null);
    const [selectedCV, setSelectedCV] = useState<any | null>(null); // CV được chọn

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
                    // Giả sử chọn CV mặc định hoặc CV đầu tiên nếu không có selectedCVId từ PaymentPopup
                    const defaultCV = cvData.find((cv: any) => cv.isDefault);
                    setSelectedCV(defaultCV || cvData[0] || null);
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
    }, [accessToken, fetchUser, fetchCVs, fetchJobDetails, jobId]);

    const handlePayment = async () => {
        if (!jobId || jobId === 0) {
            toast.error('Không tìm thấy jobId', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        if (!selectedCV) {
            toast.error('Vui lòng chọn một CV để tiếp tục', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        setIsProcessing(true);

        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_APP_API_BASE_URL}/users/compare-competitiveness/${jobId}/${selectedCV}`,
                {
                    resumeCVId: selectedCV.resumeCVId, // Gửi ID của CV đã chọn
                },
                { headers }
            );

            toast.success('Thanh toán và phân tích thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Điều hướng hoặc hiển thị kết quả phân tích
            console.log('Kết quả phân tích:', response.data.data);
            router.push('/Auth/User/chatAI/result/compareCompetitiveness'); // Điều hướng đến trang kết quả (có thể tùy chỉnh)
        } catch (error: any) {
            console.error('Lỗi khi gọi API:', error);
            toast.error(
                error.response?.data?.message || 'Có lỗi xảy ra khi phân tích mức độ cạnh tranh',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // Tính toán giá tiền
    const basePrice = parseInt(process.env.NEXT_PUBLIC_APP_PRICE_AI || '25000'); // Giá mặc định là 25.000
    const taxRate = 0.1; // 10% VAT
    const totalWithoutTax = Math.round(basePrice / (1 + taxRate)); // Tổng cộng (Chưa bao gồm thuế)
    const totalWithTax = basePrice; // Số tiền thanh toán (Đã bao gồm 10% VAT)

    return (
        <section className={styles.PaymentPage}>
            <h2 className={styles.paymentSection__title}>Checkout</h2>
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
                            <span className={styles.user_infomation__item}>{user?.email}</span>
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
                                    <p>{selectedCV?.name_file || 'Chưa chọn CV'}</p> (ID: {selectedCV?.resumeCVId || 'N/A'}) vị trí{' '}
                                    <p>{jobDetails?.title || 'Chưa tải job'}</p> (ID: {jobId})
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
                            <input
                                type="checkbox"
                                id="vatInfo"
                                className={styles.summaryDetails__checkbox}
                            />
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