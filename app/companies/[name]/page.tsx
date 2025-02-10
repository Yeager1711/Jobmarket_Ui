'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Job } from '../../interface/Job';
import styles from './name.module.scss';
import classNames from 'classnames';
import { formatSalary } from '../../Ultils/formatSalary';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import HotJob from '../../Ultils/HotJob/HotJob';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function NameCompany() {
    const router = useRouter();
    const params = useParams();
    const name = params?.name;

    const [jobCompany, setJobCompany] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!name) {
            setError('Company name not found');
            setLoading(false);
            return;
        }

        const fetchCompanyName = async () => {
            try {
                const response = await fetch(`${apiUrl}/jobs/by-nameCompany/${name}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch company data');
                }
                const { data } = await response.json();
                setJobCompany(data);
            } catch (error) {
                console.error('Error fetching job company:', error);
                setError('Error fetching job company data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyName();
    }, [name]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section className={styles.jobCompany}>
            <div className={styles.common__information}>
                {jobCompany.length > 0 && (
                    <div className={styles.image_company}>
                        <img
                            src={jobCompany[0].company.images[0]?.image_company || 'default-image.png'}
                            alt={jobCompany[0].company.name}
                        />

                        <div className={styles.content}>
                            <div className={styles.name__company}>{jobCompany[0].company.name}</div>

                            <div className={styles.district__company}>{jobCompany[0].workLocation.address_name}</div>

                            <a href="#job" className={styles.total__job}>
                                {jobCompany.length} vị trí tuyển dụng
                            </a>
                        </div>
                    </div>
                )}
            </div>
            <h2 id="job">Vị trí ứng tuyển</h2>
            <div className={styles.wrapper__groupJob}>
                {jobCompany.map((job) => (
                    <div
                        onClick={() => router.push(`/jobs/job_details/${job.jobId}`)}
                        className={styles.job}
                        key={job.jobId}
                    >
                        <HotJob isHot={job.Hot_Job !== 'Null'}>{job.Hot_Job}</HotJob>

                        <span className={styles['icon-views']}>
                            <FontAwesomeIcon icon={faEye} />
                            {job.view}
                        </span>

                        <div className={styles.image_company}>
                            <img
                                src={job.company.images[0]?.image_company || 'default-image.png'}
                                alt={job.company.name}
                            />
                        </div>

                        <div className={styles.content__job}>
                            <div className={styles.title}>
                                <h3>{job.title}</h3>
                            </div>

                            <div className={styles.name__company}>{job.company.name}</div>

                            <div className={styles.salary}>
                                {job.salary_from === 0 || job.salary_to === 0 ? (
                                    <>Thoả thuận</>
                                ) : (
                                    <>{formatSalary(job.salary)}</>
                                )}
                            </div>

                            <div className={styles.company__district}>{job.workLocation.address_name}</div>
                            <div className={styles.tech_stack}>
                                {job.generalInformation.tech_stack.map((tech, index) => (
                                    <p
                                        onClick={() => router.push(`/skill_tag/${tech}`)}
                                        key={index}
                                        className={styles.tech__stack}
                                    >
                                        {tech}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default NameCompany;
