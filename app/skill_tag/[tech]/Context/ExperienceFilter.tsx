import React from 'react';
import styles from '../jobTag.module.scss';

interface ExperienceFilterProps {
    experience: string;
    handleExperienceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ExperienceFilter: React.FC<ExperienceFilterProps> = ({ experience, handleExperienceChange }) => {
    const experienceOptions = [
        'Tất cả',
        'Không yêu cầu',
        'Dưới 1 năm',
        '1 năm',
        '2 năm',
        '3 năm',
        '4 năm',
        '5 năm',
        '6 năm',
        '7 năm',
        '8 năm',
        '9 năm',
        '10 năm',
        'Trên 10 năm',
    ];

    return (
        <div className={styles.experience}>
            <span>Kinh nghiệm</span>
            <div className={styles.list_experience_item}>
                {experienceOptions.map((item) => (
                    <div className={styles.experience_item} key={item}>
                        <input
                            type="radio"
                            value={item}
                            checked={experience === item}
                            onChange={handleExperienceChange}
                        />
                        <label>{item}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceFilter;
