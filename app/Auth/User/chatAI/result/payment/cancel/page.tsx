'use client';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function PaymentCancel() {
    const router = useRouter();

    useEffect(() => {
        toast.error('Thanh toán đã bị hủy.');
        setTimeout(() => router.push('/checkout'), 3000); // Quay lại trang checkout
    }, [router]);

    return (
        <div>
            <h1>Thanh toán bị hủy</h1>
            <p>Bạn đã hủy thanh toán. Vui lòng thử lại.</p>
        </div>
    );
}