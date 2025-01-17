import React, { useState, useEffect } from 'react';
import styles from './OutstandingCompany.module.scss';
import { Job } from '../../../interface/Job';
import { useRouter } from 'next/navigation';
const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
import Link from 'next/link';

function OutstandingCompany() {
    const [jobData, setJobData] = useState<Job[]>([]);
    const [groupedCompanies, setGroupedCompanies] = useState<{
        [key: string]: { name: string; district: string; jobs: Job[] };
    }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const response = await fetch(`${apiUrl}/jobs/all-jobs`);
                const data = await response.json();
                setJobData(data.data);

                const grouped = data.data.reduce((acc: any, job: Job) => {
                    const key = `${job.company?.name || 'N/A'}_${job.workLocation?.district?.name || 'N/A'}`;
                    if (!acc[key]) {
                        acc[key] = {
                            name: job.company?.name || 'N/A',
                            district: job.workLocation?.district?.name || 'N/A',
                            jobs: [],
                        };
                    }
                    acc[key].jobs.push(job);
                    return acc;
                }, {});

                setGroupedCompanies(grouped);
                setLoading(false);
            } catch (err) {
                setError('Có lỗi xảy ra khi lấy dữ liệu');
                setLoading(false);
            }
        };

        fetchAllJobs();
    }, []);

    const getSizeClass = (jobCount: number) => {
        if (jobCount >= 20) return 'size-5';
        if (jobCount >= 10) return 'size-4';
        if (jobCount >= 5) return 'size-3';
        if (jobCount >= 2) return 'size-2';
        return 'size-1';
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('draggedIndex', index.toString());
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        const draggedIndex = Number(e.dataTransfer.getData('draggedIndex'));
        const newOrder = [...Object.keys(groupedCompanies)];

        // Move the dragged item to the target position
        const [movedItem] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, movedItem);

        const newGroupedCompanies = newOrder.reduce((acc: any, key, idx) => {
            acc[key] = groupedCompanies[key];
            return acc;
        }, {});

        setGroupedCompanies(newGroupedCompanies);
    };

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.OutstandingCompany}>
            <div className={styles.OutstandingCompany__wrapper}>
                <div className={styles.OutstandingCompany__container}>
                    <div className={styles.title}>
                        <h3>
                            Công ty nổi bật
                            <p>
                                <Link href="/companies">Xem thêm</Link>
                            </p>
                        </h3>
                    </div>
                    {Object.keys(groupedCompanies)
                        .filter((key) => groupedCompanies[key].jobs.length > 2)
                        .slice(0, 15)
                        .map((key, index) => {
                            const company = groupedCompanies[key];
                            const firstJob = company.jobs[0];
                            const sizeClass = getSizeClass(company.jobs.length);

                            return (
                                <div
                                    className={`${styles.company_box} ${styles[sizeClass]}`}
                                    key={key}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragOver={(e) => e.preventDefault()} // Allow drop
                                    onClick={() => router.push(`/companies/${company.name}`)}
                                >
                                    <div className={styles.company__image}>
                                        <img
                                            src={firstJob.company?.images[0]?.image_company || ''}
                                            alt={company.name}
                                        />
                                    </div>
                                    <div className={styles.company_content}>
                                        <h3>{company.name}</h3>
                                        <div className={styles.company_content__details}>
                                            <span className={styles.total__job}>
                                                Số lượng tuyển: {company.jobs.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            <div className={styles.advertising_posters}>
                <div className={styles.image_ads}>
                    <img src="/images/ads_poster.jpg" alt="" />

                    <div className={styles.content_ads}></div>
                </div>
            </div>
        </div>
    );
}

export default OutstandingCompany;
