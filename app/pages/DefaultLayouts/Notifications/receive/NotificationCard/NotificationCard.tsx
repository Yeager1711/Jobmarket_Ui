import { useState, useRef } from 'react';
import styles from './NotificationCard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const NotificationCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null); // Explicitly define the ref type

    const handleSubscribe = () => {
        setIsModalOpen(true);
    };

    const handleEmailChange = (e: any) => {
        const inputValue = e.target.value;
        const trimmedValue = inputValue.trimStart(); // Prevent leading spaces
        let baseEmail = trimmedValue.replace(/@gmail\.com$/, ''); // Remove @gmail.com if it exists

        if (baseEmail) {
            setEmail(baseEmail + '@gmail.com');
        } else {
            setEmail(''); // Clear the email if input is empty
        }

        // Asserting that inputRef.current is not null
        setTimeout(() => {
            const cursorPosition = baseEmail.length;
            inputRef.current!.setSelectionRange(cursorPosition, cursorPosition); // Assert that current is not null
        }, 0);
    };

    const handleSubmit = () => {
        if (email && email.includes('@gmail.com') && email.length > 10) {
            console.log(`Subscribed with email: ${email}`);
            setIsModalOpen(false);
            alert('Cảm ơn bạn đã đăng ký nhận thông báo!');
        } else {
            alert('Vui lòng nhập email hợp lệ!');
        }
    };

    return (
        <section className={styles.notificationCard}>
            <div className={styles.content}>
                <img src="/images/setting-mailbox.png" alt="Email Notification" />
                <div>
                    <h3>Nhận thông báo qua email</h3>
                    <span>
                        <a href="#">Job Market</a> luôn luôn cập nhật những công việc làm mới mỗi ngày, hãy để{' '}
                        <a href="#">Job Market</a> gửi thông báo cho bạn khi có việc làm mới phù hợp.
                    </span>
                </div>
            </div>
            <button className={styles.subscribeButton} onClick={handleSubscribe}>
                <FontAwesomeIcon icon={faBell} /> Nhận thông báo
            </button>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Đăng ký nhận thông báo</h3>
                        <input
                            type="text"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={handleEmailChange}
                            ref={inputRef}
                            className={styles.input}
                        />
                        <div className={styles.modalActions}>
                            <button className={styles.submitButton} onClick={handleSubmit}>
                                Xác nhận
                            </button>
                            <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default NotificationCard;
