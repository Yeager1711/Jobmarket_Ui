'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import styles from './success.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useApi } from '../../../../../../Context/ApiContext/ApiContext';

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { analyzeCompetitiveness } = useApi();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Lấy query parameters, thêm orderId
    const orderCode = searchParams.get('orderCode');
    const orderId = searchParams.get('orderId') ? parseInt(searchParams.get('orderId') as string) : 0;
    const jobId = searchParams.get('jobId') ? parseInt(searchParams.get('jobId') as string) : 0;
    const resumeCVId = searchParams.get('resumeCVId')
        ? parseInt(searchParams.get('resumeCVId') as string)
        : 0;
    const status = searchParams.get('status');

    // Hiển thị thông báo thanh toán
    useEffect(() => {
        if (status === 'PAID' && orderCode) {
        } else if (status === 'CANCELLED') {
            toast.error('Thanh toán đã bị hủy.');
        } else {
            toast.error('Có lỗi xảy ra trong quá trình thanh toán.');
        }
    }, [orderCode, status]);

    // Hàm xử lý khi nhấn "Xem kết quả"
    const handleViewResult = async () => {
        if (!jobId || !resumeCVId || !orderCode) {
            toast.error('Không tìm thấy thông tin jobId, resumeCVId hoặc orderId.');
            router.push('/'); // Chuyển về trang chủ nếu thiếu thông tin
            return;
        }

        setIsAnalyzing(true);
        try {
            console.log('orderId gửi đi:', orderId);
            console.log('jobId gửi đi:', jobId);
            console.log('resumeCVId gửi đi:', resumeCVId);

            // Gọi API phân tích AI từ ApiContext
            await analyzeCompetitiveness(jobId, resumeCVId); // Giả sử API chưa cần orderId
            toast.success('Phân tích AI thành công!');

            // Chuyển hướng đến trang compareCompetitiveness với orderId bổ sung
            router.push(
                `/Auth/User/chatAI/result/compareCompetitiveness?orderCode=${orderCode}&jobId=${jobId}&resumeCVId=${resumeCVId}`
            );
        } catch (error: any) {
            console.error('Lỗi khi gọi API phân tích AI:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
                <h1 className={styles.title}>
                    {status === 'PAID' ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
                </h1>
                <p className={styles.message}>
                    (Mã đơn hàng phân tích AI:{' '}
                    <span className={styles.orderCode}>{orderCode || 'N/A'}</span>)
                </p>
                <p className={styles.thankYou}>
                    {status === 'PAID'
                        ? 'Cảm ơn bạn đã sử dụng dịch vụ của JobMarket!'
                        : 'Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
                </p>
                {status === 'PAID' && (
                    <button
                        className={styles.backButton}
                        onClick={handleViewResult}
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? 'Đang phân tích...' : 'Xem kết quả'}
                    </button>
                )}
            </div>
        </div>
    );
}