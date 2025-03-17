// UserController_Skeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './UserControl.module.scss';

const UserController_Skeleton = () => {
    return (
        <div className={styles.user_control} >
            <div className={styles.user_infomation}>
                <div className={styles.image_user}>
                    <Skeleton width={88} height={88} borderRadius={40} />
                </div>
                <div className={styles.infomation}>
                    <span className={styles.fullname}>
                        <Skeleton width={180} height={15} />
                    </span>
                    <span className={styles.candidate_code}>
                        <Skeleton width={160} height={15} />
                    </span>
                    <span className={styles.email}>
                        <Skeleton width={200} height={15} />
                    </span>
                </div>
            </div>

            {/* Tạm thời bỏ qua control_link và podcard để phù hợp với kích thước khung 300x150 */}
        </div>
    );
};

export default UserController_Skeleton;
