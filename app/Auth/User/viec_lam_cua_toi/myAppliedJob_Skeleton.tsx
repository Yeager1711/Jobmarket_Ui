'use client';
import styles from './myJob.module.scss';

const MyAppliedJob_Skeleton = () => {
    return (
        <div className={styles.job_applied_lists}>
            {Array(2).fill(0).map((_, index) => (
                <div key={index} className={styles.box_applied_job}>
                    <div className={styles.image_company}>
                        <div
                            style={{
                                width: '150px',
                                height: '150px',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '8px',
                                animation: 'pulse 1.5s infinite',
                            }}
                        />
                    </div>
                    <div className={styles.job_applied_content__company}>
                        <div
                            className={styles.title}
                            style={{
                                width: '70%',
                                height: '20px',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '4px',
                                marginBottom: '10px',
                                animation: 'pulse 1.5s infinite',
                            }}
                        />
                        <div className={styles.box_marLeft}>
                            <span
                                className={styles.company_name}
                                style={{
                                    width: '50%',
                                    height: '16px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    marginRight: '10px',
                                    animation: 'pulse 1.5s infinite',
                                }}
                            />
                            <span
                                className={styles.district_name}
                                style={{
                                    width: '30%',
                                    height: '16px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    marginRight: '10px',
                                    animation: 'pulse 1.5s infinite',
                                }}
                            />
                            <span
                                className={styles.salary}
                                style={{
                                    width: '20%',
                                    height: '16px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    marginRight: '10px',
                                    animation: 'pulse 1.5s infinite',
                                }}
                            />
                            <span
                                className={styles.AI_analysis}
                                style={{
                                    width: '60%',
                                    height: '16px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    animation: 'pulse 1.5s infinite',
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.6; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default MyAppliedJob_Skeleton;