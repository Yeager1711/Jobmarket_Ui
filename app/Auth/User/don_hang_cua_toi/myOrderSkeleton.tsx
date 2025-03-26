'use client';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './MyOrders.module.scss';
import UserControl from '../userControl/UserControl';

const OrderTableSkeleton = () => {
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
                                <Skeleton width={150} height={20} />
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Email</span>
                            <span className={styles.value}>
                                <Skeleton width={150} height={20} />
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Địa chỉ</span>
                            <span className={styles.value}>
                                <Skeleton width={150} height={20} />
                            </span>
                        </div>
                    </div>

                    {/* Lịch sử đơn hàng */}
                    <div className={styles.orderHistory}>
                        <div className={styles.header}>
                            <h2>Lịch sử thanh toán</h2>
                            <div className={styles.filter}>
                                <span>Tất cả</span>
                                <Skeleton width={20} height={20} />
                            </div>
                        </div>
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
                                    {[...Array(3)].map((_, index) => (
                                        <tr key={index}>
                                            <td data-label="Vị trí">
                                                <Skeleton width={150} height={20} />
                                            </td>
                                            <td data-label="Số lượng">
                                                <Skeleton width={50} height={20} />
                                            </td>
                                            <td data-label="Đơn giá">
                                                <Skeleton width={80} height={20} />
                                            </td>
                                            <td data-label="Ngày mua">
                                                <Skeleton width={100} height={20} />
                                            </td>
                                            <td data-label="Trạng thái">
                                                <Skeleton width={80} height={20} />
                                            </td>
                                            <td data-label="Thao tác">
                                                <Skeleton width={100} height={30} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderTableSkeleton;