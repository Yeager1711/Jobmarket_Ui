'use client';
import { useState, useEffect } from 'react';
import styles from './companies.module.scss';
import { useRouter, useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Companies_Skeleton from './companies_skeleton';
import { Job } from '../interface/Job';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function Companies() {
    const router = useRouter();
    const [jobData, setJobData] = useState<Job[]>([]);
    const [groupedCompanies, setGroupedCompanies] = useState<{
        [key: string]: { name: string; district: string; jobs: Job[] };
    }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchAllJobsByCompanyName = async () => {
            try {
                const response = await fetch(`${apiUrl}/jobs/all-jobs`);
                const data = await response.json();
                setJobData(data.data);

                const grouped = data.data.reduce((acc: any, job: Job) => {
                    const key = `${job.company.name}_${job.workLocation.district.name}`;
                    if (!acc[key]) {
                        acc[key] = {
                            name: job.company.name,
                            district: job.workLocation.district.name,
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

        fetchAllJobsByCompanyName();
    }, []);

    const filteredCompanies = Object.keys(groupedCompanies).filter((key) =>
        groupedCompanies[key].name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

    const getCurrentPageJobs = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredCompanies.slice(startIndex, endIndex);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section className={styles.companies + ' marTop'}>
            <div className={styles['find-companies']}>
                <div className={styles['find-companies__wrapper']}>
                    <div className={styles['companies__input']}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm công ty ...."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className={styles['find-companies__button']}>
                        <button>Tìm công ty</button>
                    </div>
                </div>
            </div>

            <section className={styles['recruitment-companies']}>
                <h3>
                    <p>Việc làm tuyển dụng</p> Công ty hàng đầu
                </h3>

                <div className={styles['recruitment-companies__wapper']}>
                    {loading
                        ? Companies_Skeleton()
                        : getCurrentPageJobs().map((key) => {
                              const company = groupedCompanies[key];
                              const firstJob = company.jobs[0];
                              return (
                                  <div
                                      onClick={() => router.push(`/companies/${company.name}`)}
                                      className={styles['box-company']}
                                      key={key}
                                  >
                                      <div className={styles['company-logo__wrapper']}>
                                          <div className={styles['company-logo']}>
                                              <img src={firstJob.company.images[0]?.image_company} alt={company.name} />
                                          </div>
                                          <div className={styles['company-logo__border']}>
                                              <img src={firstJob.company.images[0]?.image_company} alt={company.name} />
                                          </div>
                                          <div className={styles['company-content']}>
                                              <h3>{company.name}</h3>
                                              <div className={styles['company-content__details']}>
                                                  <span className={styles['company-district']}>{company.district}</span>
                                                  <span className={styles['total__job']}>
                                                      Số lượng công việc tuyển dụng: {company.jobs.length}
                                                  </span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                </div>

                <div className={styles['pagination']}>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <span>
                        {currentPage} / {totalPages} Trang
                    </span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </section>
        </section>
    );
}

export default Companies;
