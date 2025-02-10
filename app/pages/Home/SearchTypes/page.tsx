import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

import { showToastError, showToastSuccess } from '../../../Ultils/toast';
import styles from './SearchTypes.module.scss';
import 'aos/dist/aos.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faChevronLeft,
    faChevronRight,
    faChevronDown,
    faChevronUp,
    faFire,
} from '@fortawesome/free-solid-svg-icons';
import { CiLocationOn } from 'react-icons/ci';

import { formatSalary } from '../../../Ultils/formatSalary';

import { Job } from '../../../interface/Job';
import { toast } from 'react-toastify';
import HotJob from 'app/Ultils/HotJob/HotJob';

import { useHandleViewJob } from '../../../Ultils/hanle__viewJob';

import SearchTypes_Skeleton from './SearchTypes_Skeleton';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
const pathJobs = process.env.NEXT_PUBLIC_APP_PATH_URL;
console.log('pathname', pathJobs);

const SearchTypes = () => {
    const pathname = usePathname();
    const handleViewJob = useHandleViewJob();

    // Job by types
    const [allJobData, setAllJobData] = useState<Job[]>([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const [jobLevels, setJobLevels] = useState<string[]>([]);
    const [jobIndustry, setJobIndustry] = useState<string[]>([]);
    const [jobExperience, setJobExperience] = useState<string[]>([]);
    const [jobTypesWorkAt, setJobTypesWorkAt] = useState<string[]>([]);
    const [selectedCompanyField, setSelectedCompanyField] = useState('');
    const [techStack, setTechStack] = useState<string[]>([]);
    const [jobDistrict, setJobDistrict] = useState<string[]>([]);

    // buton clear All
    const [currency, setCurrency] = useState('Tr');
    const [filteredJobsType, setFilteredJobsType] = useState<Job[]>([]);
    const [currentPage_Type, setCurrentPage_Type] = useState(1);
    const [totalPages_Type, setTotalPages_Type] = useState(1);

    const [selectedJobType, setSelectedJobType] = useState('');
    const [selectedJobExperience, setSelectedJobExperience] = useState('');
    const [selectedWorkAt, setSelectedWorkAt] = useState('');
    const [selectedJobDistrict, setSelectedJobDistrict] = useState('');

    const [isPopupOpen, setPopupOpen] = useState(false);
    const [fromSalary, setFromSalary] = useState('');
    const [toSalary, setToSalary] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleApply = () => {
        console.log('Mức lương từ:', fromSalary);
        console.log('Mức lương đến:', toSalary);
        setPopupOpen(false);
    };

    const itemsPerPage_Type = pathname === pathJobs ? 21 : 12;
    // Cập nhật danh sách phân trang
    const jobsToDisplay =
        Array.isArray(filteredJobsType) && filteredJobsType.length > 0
            ? filteredJobsType
            : Array.isArray(allJobData)
              ? allJobData
              : [];

    // Tính tổng số trang
    useEffect(() => {
        setTotalPages_Type(Math.ceil(jobsToDisplay.length / itemsPerPage_Type));
        console.log('Total jobs:', jobsToDisplay.length / itemsPerPage_Type);
    }, [jobsToDisplay, itemsPerPage_Type]);

    // Lấy dữ liệu phân trang
    const paginatedJobs = Array.isArray(jobsToDisplay)
        ? jobsToDisplay.slice((currentPage_Type - 1) * itemsPerPage_Type, currentPage_Type * itemsPerPage_Type)
        : [];
    // Xử lý khi thay đổi trang
    const handlePageChange_Types = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages_Type) {
            setCurrentPage_Type(newPage);
        }
    };

    const handleSearch = () => {
        const filteredJobs = allJobData.filter((job) => {
            // Existing filters
            const matchesJobLevel = selectedJobType === '' || job.jobLevel.name.includes(selectedJobType);
            const matchesExperience =
                selectedJobExperience === '' || job.generalInformation.experience.includes(selectedJobExperience);
            const matchesWorkAt =
                selectedWorkAt === '' ||
                (Array.isArray(job.jobType.work_at) &&
                    job.jobType.work_at.some((workAt) => workAt.toLowerCase() === selectedWorkAt.toLowerCase()));

            const matchesTechStack =
                techStack.length === 0 ||
                techStack.some((tech) =>
                    job.generalInformation.tech_stack.some((skill) => skill.toLowerCase().includes(tech.toLowerCase()))
                );

            // Salary filtering logic
            const salaryFilter = () => {
                // Nếu không chọn khoảng lương, trả về true
                if (!fromSalary || !toSalary) return true;

                // Kiểm tra nếu là dạng "Tr" và nhân với 1,000,000
                const from = currency === 'Tr' ? parseFloat(fromSalary) * 1000000 : parseFloat(fromSalary);
                const to = currency === 'Tr' ? parseFloat(toSalary) * 1000000 : parseFloat(toSalary);

                // Lọc lương cho VND
                if (currency === 'Tr') {
                    // Kiểm tra nếu lương trong khoảng từ và đến
                    if (job.salary_from > 1000000 && job.salary_to > 1000000) {
                        return job.salary_from >= from && job.salary_to <= to;
                    }
                    return false;
                } else {
                    // Kiểm tra nếu lương trong khoảng từ và đến cho USD
                    if (job.salary_from < 1000000 && job.salary_to < 1000000) {
                        return job.salary_from >= from && job.salary_to <= to;
                    }
                    return false;
                }
            };

            const matchesDistrict =
                selectedJobDistrict === '' ||
                job.workLocation.district.name.toLowerCase().includes(selectedJobDistrict.toLowerCase());

            const matchesComapniesField =
                selectedCompanyField === '' ||
                job.jobIndustry.name.toLowerCase().includes(selectedCompanyField.toLowerCase());

            // Combine all filters
            return (
                matchesJobLevel &&
                matchesTechStack &&
                matchesExperience &&
                matchesWorkAt &&
                matchesDistrict &&
                matchesComapniesField &&
                salaryFilter()
            );
        });

        if (filteredJobs.length === 0) {
            showToastError('Không tìm thấy công việc phù hợp!');
        }

        setFilteredJobsType(filteredJobs);
    };

    const handleTechStackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTechStack([event.target.value]);
    };

    const [mostPopularTechStacks, setMostPopularTechStacks] = useState<string[]>([]);
    const [lessPopularTechStacks, setLessPopularTechStacks] = useState<string[]>([]);
    const [ortherPopularTechStacks, setOrtherPopularTechStacks] = useState<string[]>([]);
    const [showTechStackFilters, setShowTechStackFilters] = useState(false);

    // Tạo ref cho `keyword_suggestions`
    const keywordSuggestionsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (keywordSuggestionsRef.current && !keywordSuggestionsRef.current.contains(event.target as Node)) {
                setShowTechStackFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${apiUrl}/jobs/all-jobsTypes`);
                const result = await response.json();
                console.log('result: ', result);
                if (response.ok) {
                    const sortedJobs = (result.data.jobs || []).sort(
                        (a: any, b: any) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
                    );

                    setAllJobData(sortedJobs);
                    setJobLevels(result.data.category.jobLevels || []);
                    setTechStack(result.data.category.TechStack || []);
                    setJobIndustry(result.data.category.jobIndustries || []);
                    setJobExperience(result.data.category.Experience || []);
                    setJobTypesWorkAt(result.data.category.jobTypesWorkAt || []);
                    setJobDistrict(result.data.category.jobDistrict || []);

                    // Đếm số lượng công ty tuyển dụng theo tech_stack
                    const techStackCount: Record<string, number> = {};

                    sortedJobs.forEach((job: any) => {
                        const techStack = job.generalInformation?.tech_stack || [];
                        techStack.forEach((stack: string) => {
                            techStackCount[stack] = (techStackCount[stack] || 0) + 1;
                        });
                    });

                    // Sắp xếp tech_stack theo số lượng giảm dần
                    const sortedTechStacks = Object.entries(techStackCount)
                        .sort(([, countA], [, countB]) => countB - countA)
                        .map(([stack]) => stack);

                    // Lấy 10 phổ biến nhất và còn lại
                    setMostPopularTechStacks(sortedTechStacks.slice(0, 25));
                    setLessPopularTechStacks(sortedTechStacks.slice(25, 43));
                    setOrtherPopularTechStacks(sortedTechStacks.slice(20));
                } else {
                    setError('Failed to fetch job types');
                    console.error('Response not OK:', result);
                }
            } catch (err) {
                setError('Có lỗi xảy ra khi lấy dữ liệu');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllJobs();
    }, []);

    const handleAdvancedFilterToggle = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
        setPopupOpen(false);
    };

    const handleJobTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedJobType(event.target.value);
    };

    const handleJobDistrict = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedJobDistrict(event.target.value);
    };

    const handleJobExperience = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedJobExperience(event.target.value);
    };

    const handleJobTypesWorkAt = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWorkAt(event.target.value);
    };

    const handleCompanyFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCompanyField(event.target.value);
    };

    const handleClearAll = () => {
        setTechStack([]);
        setSelectedJobType('');
        setSelectedJobExperience('');
        setSelectedWorkAt('');
        setSelectedJobDistrict('');
        setSelectedCompanyField('');
        setFilteredJobsType([]);
        setFromSalary('');
        setToSalary('');
        showToastSuccess('All filters cleared!');
    };

    return (
        <section className={styles.jobByTypes}>
            {pathname !== `${pathJobs}` && <h2>Việc làm theo loại</h2>}
            {pathname === `${pathJobs}` && (
                <h3>
                    <p>{jobsToDisplay.length} Việc làm phù hợp</p> Tất cả
                </h3>
            )}

            <div className={styles.wrapper_list__jobTypes}>
                <div className={styles.list__item}>
                    <div className={`${styles.header} ${showAdvancedFilters ? styles.expanded : ''}`}>
                        <div className={styles.wrapper_tool}>
                            <div>
                                <h3>Việc làm theo</h3>
                            </div>
                            <div className={styles.box__field__list}>
                                <div className={styles.selection__items__techStack}>
                                    <div className={styles.input__TechStack}>
                                        <input
                                            type="text"
                                            placeholder="Chọn các từ khóa tuyển dụng: Java, JavaScript, C#, PHP ..."
                                            onFocus={() => setShowTechStackFilters(true)}
                                            onChange={() => {}}
                                            readOnly
                                        />
                                        <div
                                            className={`${styles.keyword_suggestions} ${
                                                showTechStackFilters ? styles.visible : styles.hidden
                                            }`}
                                            ref={keywordSuggestionsRef}
                                        >
                                            <div className={styles.wrapper_keyword__suggestions}>
                                                <div className={styles.Most_recruiting_keywords}>
                                                    <h4>Từ khóa đang được tuyển dụng nổi trội</h4>
                                                    <div className={styles.box__Most_recruiting_keywords}>
                                                        {mostPopularTechStacks.map((stack, index) => (
                                                            <a
                                                                key={index}
                                                                href={`/skill_tag/${stack}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.popular}
                                                            >
                                                                <FontAwesomeIcon icon={faFire} />
                                                                {stack}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={styles.Less_recruiting_keywords}>
                                                    <h4>Từ khóa đang tuyển dụng nhiều </h4>
                                                    <div className={styles.box__Less_recruiting_keywords}>
                                                        {lessPopularTechStacks.map((stack, index) => (
                                                            <a
                                                                key={index}
                                                                href={`/skill_tag/${stack}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.lessPopular}
                                                            >
                                                                {stack}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className={styles.orther_recruiting_keywords}>
                                                    <h4>Khác: </h4>
                                                    <div className={styles.box__orther_recruiting_keywords}>
                                                        {ortherPopularTechStacks.map((stack, index) => (
                                                            <a
                                                                key={index}
                                                                href={`/skill_tag/${stack}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.ortherPopular}
                                                            >
                                                                {stack}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.btn__search} onClick={handleSearch}>
                                    Tìm kiếm
                                </div>
                                <div className={styles.btn__advanced} onClick={handleAdvancedFilterToggle}>
                                    Tìm kiếm nâng cao{' '}
                                    <FontAwesomeIcon icon={showAdvancedFilters ? faChevronUp : faChevronDown} />
                                </div>

                                <div className={styles.btnClearAll} onClick={handleClearAll}>
                                    Clear All
                                </div>
                            </div>
                        </div>

                        {showAdvancedFilters && (
                            <div className={`${styles.advancedFilters} ${showAdvancedFilters ? styles.visible : ''}`}>
                                <div className={styles.filterItem}>
                                    <label>Vị trí</label>
                                    <select value={selectedJobType} onChange={handleJobTypeChange}>
                                        <option value="">Tất cả</option>
                                        {jobLevels?.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {pathname === '/jobs' && (
                                    <div className={styles.filterItem}>
                                        <label>Địa điểm</label>
                                        <select value={selectedJobDistrict} onChange={handleJobDistrict}>
                                            <option value="">Tất cả</option>
                                            {jobDistrict?.map((district) => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className={styles.filterItem}>
                                    <label title="Kinh nghiệm">Kinh nghiệm</label>
                                    <select value={selectedJobExperience} onChange={handleJobExperience}>
                                        <option value="">Tất cả</option>
                                        {jobExperience?.map((experience) => (
                                            <option key={experience} value={experience}>
                                                {experience}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.filterItem__salary}>
                                    <div className={styles.dropdown} onClick={() => setPopupOpen(!isPopupOpen)}>
                                        <span>
                                            {fromSalary && toSalary
                                                ? `${fromSalary} - ${toSalary} ${currency}`
                                                : 'Chọn mức lương'}
                                        </span>
                                    </div>

                                    {isPopupOpen && (
                                        <div className={styles.popup}>
                                            <div className={styles.choose_moneyType}>
                                                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                                    <option value="Tr">VNĐ</option>
                                                    <option value="USD">USD</option>
                                                </select>
                                            </div>
                                            <div className={styles.flex__input}>
                                                <div className={styles.inputGroup}>
                                                    <input
                                                        type="number"
                                                        value={fromSalary}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (parseFloat(value) < 0 || e.target.value === '0') return;
                                                            setFromSalary(e.target.value);
                                                        }}
                                                        placeholder="Từ"
                                                    />
                                                </div>
                                                <div className={styles.inputGroup}>
                                                    <input
                                                        type="number"
                                                        value={toSalary}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (parseFloat(value) < 0 || e.target.value === '0') return;

                                                            setToSalary(e.target.value);
                                                        }}
                                                        placeholder="Đến"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                className={styles.applyButton}
                                                onClick={handleApply}
                                                disabled={
                                                    parseFloat(toSalary) <= parseFloat(fromSalary) ||
                                                    parseFloat(fromSalary) <= 0 ||
                                                    parseFloat(toSalary) <= 0
                                                }
                                            >
                                                Áp dụng
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.filterItem}>
                                    <label title="Hình thức làm việc">Hình thức làm việc</label>
                                    <select value={selectedWorkAt} onChange={handleJobTypesWorkAt}>
                                        <option value="">Tất cả</option>
                                        {jobTypesWorkAt?.map((workAt) => (
                                            <option key={workAt} value={workAt}>
                                                {workAt}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.filterItem}>
                                    <label title="Lĩnh vực công ty">Lĩnh vực công ty</label>
                                    <select value={selectedCompanyField} onChange={handleCompanyFieldChange}>
                                        <option value="">Tất cả</option>
                                        {jobIndustry?.map((industry) => (
                                            <option key={industry} value={industry}>
                                                {industry}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.container}>
                        {loading ? (
                            SearchTypes_Skeleton()
                        ) : paginatedJobs.length > 0 ? (
                            paginatedJobs
                                .sort((a, b) => Number(b.Hot_Job !== 'Null') - Number(a.Hot_Job !== 'Null'))
                                .map((job) => (
                                    <div
                                        onClick={() => handleViewJob(job.jobId)}
                                        className={styles.job}
                                        key={job.jobId}
                                    >
                                        <span className={styles.views}>
                                            {' '}
                                            <FontAwesomeIcon icon={faEye} /> {job.view}
                                        </span>

                                        {/* sử dụng hot job khi có job mới cần tuyển dụng gấp */}
                                        <HotJob isHot={job.Hot_Job !== 'Null'}> {job.Hot_Job}</HotJob>

                                        <div className={styles.image__logo}>
                                            <img src={job.company.images[0]?.image_company} alt={job.company.name} />
                                        </div>

                                        <div className={styles.content}>
                                            <h3 title={job.title}>{job.title}</h3>
                                            <span className={styles.name__company} title={job.company.name}>
                                                {job.company.name}
                                            </span>
                                            <span className={styles.positon}>{job.jobLevel.name.join(' - ')}</span>
                                            <span className={styles.salary}>
                                                {job.salary_to === 0 && job.salary_to === 0 ? (
                                                    <>Thỏa thuận</>
                                                ) : (
                                                    <>{formatSalary(job.salary)}</>
                                                )}
                                            </span>

                                            <span className={styles.district} title={job.workLocation.address_name}>
                                                <CiLocationOn />
                                                {job.workLocation.address_name}
                                            </span>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p>Không có công việc nào!</p>
                        )}
                    </div>
                    <div className={styles.pagination}>
                        <button
                            onClick={() => handlePageChange_Types(currentPage_Type - 1)}
                            disabled={currentPage_Type === 1}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span>
                            {currentPage_Type} / {totalPages_Type} Trang
                        </span>
                        <button
                            onClick={() => handlePageChange_Types(currentPage_Type + 1)}
                            disabled={currentPage_Type === totalPages_Type}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default SearchTypes;
