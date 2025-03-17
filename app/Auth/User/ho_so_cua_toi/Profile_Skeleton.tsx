import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton styles
import styles from './profile.module.scss'; // Import the same styles as Profile
import UserControl from '../userControl/UserControl';

const Profile_Skeleton = () => {
    return (
        <section className={styles.account_overview}>
            <div className={styles.wapper}>
                <UserControl />

              
                <div className={styles.userControl}>
                    <Skeleton height={50} width="100%" />
                </div>

                <div className={styles.account_overview__details}>
                    {/* Skeleton for Account Overview Header */}
                    <div className={styles.account_overview__header}>
                        <div className={styles.image_user}>
                            <Skeleton circle height={100} width={100} /> {/* Placeholder for user image */}
                        </div>
                        <div className={styles.user_infomation}>
                            <Skeleton height={30} width={250} /> {/* Placeholder for user name */}
                            <Skeleton height={20} width={180} style={{ marginTop: 10 }} />{' '}
                            {/* Placeholder for years of experience */}
                            <div className={styles.flex_info} style={{ marginTop: 10 }}>
                                <div className={styles.box_info}>
                                    <Skeleton height={20} width={100} /> {/* Placeholder for gender */}
                                    <Skeleton height={20} width={180} style={{ marginTop: 10 }} />{' '}
                                    {/* Placeholder for experience level */}
                                    <Skeleton height={20} width={250} style={{ marginTop: 10 }} />{' '}
                                    {/* Placeholder for email */}
                                    <Skeleton height={20} width={300} style={{ marginTop: 10 }} />{' '}
                                    {/* Placeholder for address */}
                                </div>
                                <div className={styles.box_info}>
                                    <Skeleton height={20} width={150} style={{ marginTop: 10 }} />{' '}
                                    {/* Placeholder for highest degree */}
                                    <Skeleton height={20} width={230} style={{ marginTop: 10 }} />{' '}
                                    {/* Placeholder for phone number */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skeleton for Công việc mong muốn Section */}
                    <div className={styles.account_overview__MainContent}>
                        <Skeleton height={25} width={150} /> {/* Placeholder for "Công việc mong muốn" */}
                        <div className={styles.box_mainContent} style={{ marginTop: 10 }}>
                            <Skeleton height={15} width={200} /> {/* Placeholder for "Vị trí mong muốn" */}
                            <Skeleton height={15} width={280} style={{ marginTop: 10 }} />{' '}
                            {/* Placeholder for "Mức lương mong muốn" */}
                        </div>
                    </div>

                    {/* Skeleton for Mức Độ Hoàn Chỉnh Hồ Sơ Section */}
                    <div className={styles.Level_Profile__Complete}>
                        <Skeleton height={25} width={200} /> {/* Placeholder for "Mức Độ Hoàn Chỉnh Hồ Sơ" */}
                        <div className={styles.progress_container} style={{ marginTop: 20 }}>
                            <div className={styles.progress_bar}>
                                <Skeleton height={20} width="100%" /> {/* Placeholder for progress bar */}
                            </div>
                            <div className={styles.progress_milestones}>
                                <Skeleton height={15} width={50} style={{ marginTop: 20 }}/> {/* Placeholder for "Cơ bản" */}
                                <Skeleton height={15} width={50} style={{ marginTop: 20 }}/> {/* Placeholder for "Trung bình" */}
                                <Skeleton height={15} width={100} style={{ marginTop: 20 }}/> {/* Placeholder for "Tương đối hoàn chỉnh" */}
                                <Skeleton height={15} width={50} style={{ marginTop: 20 }}/> {/* Placeholder for "Hoàn chỉnh" */}
                            </div>
                        </div>
                        <div className={styles.progress_info}>
                            <Skeleton height={20} width={350} style={{ marginTop: 20 }}/> {/* Placeholder for progress info */}
                        </div>
                        <div className={styles.progress_actions}>
                            <Skeleton height={35} width={200} borderRadius={100}/>{' '}
                            {/* Placeholder for "Cập nhật hoàn thiện hồ sơ" button */}
                        </div>
                    </div>

                    {/* Skeleton for box_infoBasic Section */}
                    <div className={styles.box_infoBasic}>
                        {/* Simulate 5 items: Vị trí mong muốn, Mức lương mong muốn, Kỹ năng, Thông tin học vấn, Bằng cấp cao nhất */}
                        {Array(5)
                            .fill(0)
                            .map((_, index) => (
                                <div key={index} className={styles.box_infoBasic__item} style={{ marginTop: 20 }}>
                                    <Skeleton height={25} width={350} /> {/* Placeholder for section title */}
                                    <Skeleton height={20} width={250} style={{ marginTop: 10 }} />{' '}
                                    {/* Placeholder for content */}
                                    <Skeleton height={20} width={130} style={{ marginTop: 10 }} />{' '}
                                    {/* Placeholder for "Thêm" link */}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile_Skeleton;
