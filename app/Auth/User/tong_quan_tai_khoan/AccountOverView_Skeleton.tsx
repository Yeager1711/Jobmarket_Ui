import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton styles
import styles from './User.module.scss'; // Import the same styles as Account_OverView
import UserControl from '../userControl/UserControl';

const AccountOverView_Skeleton = () => {
    return (
        <section className={styles.user + ' marTop'}>
            <div className={styles.wapper}>
                <UserControl />
                {/* Skeleton for UserControl */}
                <div className={styles.userControl}>
                    <Skeleton height={40} width="100%" />
                </div>

                <div className={styles.control_detail}>
                    <div className={styles.control_detail}>
                        {/* Skeleton for Overview Header */}
                        <div className={styles.overview_header}>
                            <Skeleton height={30} width={250} /> 
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    marginTop: 10,
                                }}
                            >
                                <div className={styles.flex_overview}>
                                    <Skeleton height={20} width={600} /> 
                                    <Skeleton height={20} width={300} />
                                </div>
                                <Skeleton height={40} width={120} />
                            </div>
                        </div>

                        {/* Skeleton for Resume Section */}
                        <div className={styles.resume}>
                            <Skeleton height={25} width={150} /> 
                            <div className={styles.box_resume} style={{ marginTop: 10 }}>
                                <div className={styles.box_resume__question}>
                                    <Skeleton height={20} width={100} /> 
                                    <Skeleton height={20} width={250} style={{ marginTop: 5 }} />{' '}
                                  
                                </div>
                                <Skeleton height={40} width={120} /> 
                            </div>
                            {/* Skeleton for CV Uploaded Section */}
                            <div className={styles.CV_Uploaded}>
                                <Skeleton height={25} width={150} />
                                <div>
                                    {Array(2)
                                        .fill(0)
                                        .map((_, index) => (
                                            <div key={index} className={styles.fileInfo} style={{ marginTop: 10 }}>
                                               
                                                <Skeleton height={20} width={250} style={{ marginLeft: 10 }} />{' '}
                                                <Skeleton height={20} width={200} style={{ marginLeft: 10 }} />{' '}
                                                <Skeleton height={20} width={150} style={{ marginLeft: 10 }} />{' '}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Skeleton for Overview Activity Section */}
                        <div className={styles.overview_activity}>
                            <Skeleton height={25} width={150} /> {/* Placeholder for "Hoạt động của bạn" */}
                            <div className={styles.overview_activity__container}>
                                <div className={styles.recorded_data}>
                                    {/* Simulate 2 recorded data items */}
                                    {Array(2)
                                        .fill(0)
                                        .map((_, index) => (
                                            <div key={index} className={styles.wapper_data} style={{ marginTop: 10 }}>
                                                <Skeleton height={30} width={250} />{' '}
                                                {/* Placeholder for total number */}
                                            </div>
                                        ))}
                                </div>
                                <div className={styles.chart_line}>
                                    <Skeleton height={25} width={250} />{' '}
                                    {/* Placeholder for "Thống kê việc làm đã ứng tuyển" */}
                                    <Skeleton height={300} width="100%" style={{ marginTop: 10 }} />{' '}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AccountOverView_Skeleton;
