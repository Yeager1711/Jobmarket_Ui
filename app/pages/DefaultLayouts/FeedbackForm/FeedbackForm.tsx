import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './FeedbackForm.module.scss';

const FeedbackForm = () => {
    const router = useRouter();

    const [feedback, setFeedback] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!feedback) return alert('Please select your feedback!');

        // // Pass data to another page
        // router.push({
        //   pathname: '/thank-you',
        //   query: { feedback, reason },
        // });
    };

    return (
        <section>
            <form className={styles.feedbackForm} onSubmit={handleSubmit}>
                <h3>Bạn có hài lòng với trải nghiệm tìm việc trên TopCV không?</h3>
                <div className={styles.icons}>
                    {['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'].map((item, index) => (
                        <label key={index}>
                            <input
                                type="radio"
                                name="feedback"
                                value={item}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                            <span className={styles.icon}>{item}</span>
                        </label>
                    ))}
                </div>
                <textarea placeholder="Lý do của bạn" value={reason} onChange={(e) => setReason(e.target.value)} />
                <button type="submit">Gửi</button>
            </form>
        </section>
    );
};

export default FeedbackForm;
