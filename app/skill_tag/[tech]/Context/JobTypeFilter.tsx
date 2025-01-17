import React from 'react';
import styles from '../jobTag.module.scss';

interface JobTypeFilterProps {
    jobType: string;
    handleJobType: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const JobTypeFilter: React.FC<JobTypeFilterProps> = ({ jobType, handleJobType }) => {
    const jobTypeOptions = ['Tất cả', 'Fulltime', 'Từ xa', 'Tại công ty', 'Hybrid'];

    return (
        <div className={styles.jobType}>
            <span>Hình thức làm việc</span>
            <div className={styles.list_jobType_item}>
                {jobTypeOptions.map((item) => (
                    <div className={styles.jobType_item} key={item}>
                        <input
                            type="radio"
                            value={item}
                            checked={jobType === item}
                            onChange={handleJobType}
                        />
                        <label>{item}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobTypeFilter;
