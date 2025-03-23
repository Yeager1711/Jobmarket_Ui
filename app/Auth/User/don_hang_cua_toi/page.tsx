// pages/MyOrders.tsx
'use client';
import { useState, useEffect } from 'react';
import styles from './MyOrders.module.scss';
import { useApi } from '../../../Context/ApiContext/ApiContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import UserControl from '../userControl/UserControl';

interface Order {
    id: number;
    productName: string;
    position: string;
    unitPrice: string;
    quantity: number;
    total: string;
}

const MyOrders = () => {
    const { user, fetchUser } = useApi();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                // Dữ liệu đơn hàng từ hình ảnh
                const mockOrders: Order[] = [
                    {
                        id: 1,
                        productName: 'Bộ Cao Phần Tích Mức Độ Cạnh Tranh CV Huỳnh Phượng Nam_FrontEnd_Web.pdf',
                        position: '[Fresher] FRONTEND ENGINEER',
                        unitPrice: '22,727 đ',
                        quantity: 1,
                        total: '22,727 đ',
                    },
                ];
                setOrders(mockOrders);

                if (!user) {
                    await fetchUser();
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [fetchUser, user]);

    return (
        <section className={styles.MyOrders}>
            <div className={styles.wapper}>
                <UserControl />

                <div className={styles.MyOrders__details}>
                    <h1 className={styles.title}>Quản lý đơn hàng</h1>

                    <div className={styles.personalInfo}>
                        <div className={styles.header}>
                            <h2>Thông tin thanh toán</h2>
                        </div>
                        <p className={styles.note}>*Chỉ dành cho mục đích xuất hóa đơn</p>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Họ tên</span>
                            <span className={styles.value}>
                                {user
                                    ? `${user.firstName} ${user.lastName}`
                                    : '4567_Huynh Phuong Nam 4567_Huynh Phuong Nam'}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Email</span>
                            <span className={styles.value}>{user ? user.email : 'namhp1711@gmail.com'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Địa chỉ</span>
                            <span className={styles.value}>{user ? user.address : 'Hồ Chí Minh'}</span>
                        </div>
                    </div>

                    {/* Lịch sử đơn hàng */}
                    <div className={styles.orderHistory}>
                        <div className={styles.header}>
                            <h2>Lịch sử thanh toán</h2>
                            <div className={styles.filter}>
                                <span>Tất cả</span>
                                <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
                            </div>
                        </div>
                        {loading ? (
                            <div className={styles.loading}>
                                <FontAwesomeIcon icon={faSyncAlt} spin /> Đang tải...
                            </div>
                        ) : orders.length === 0 ? (
                            <div className={styles.noData}>
                                <img src="/images/no-data.png" alt="No data" className={styles.noDataImage} />
                                <p>Không có dữ liệu</p>
                            </div>
                        ) : (
                            <div className={styles.orderTableWrapper}>
                                <table className={styles.orderTable}>
                                    <thead>
                                        <tr>
                                            <th>Vị trí</th>
                                            <th>Số lượng</th>
                                            <th>Đơn giá</th>
                                            <th>Ngày mua</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td data-label="Vị trí" style={{fontWeight: '500'}}>[Fresher] FRONTEND ENGINEER (ID: 2034394)</td>
                                                <td data-label="Số lượng">1</td>
                                                <td data-label="Đơn giá">25.000</td>
                                                <td data-label="Ngày mua">23/03/2025</td>
                                                <td data-label="Trạng thái" style={{color: '#45d345'}}>Đã thanh toán</td>
                                                <td data-label="Thao tác">Analytics AI</td>
                                            </tr>

                                            
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyOrders;
