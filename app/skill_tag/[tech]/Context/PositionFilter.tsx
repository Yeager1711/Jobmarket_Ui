import React from 'react';
import styles from './PositionFilter.module.scss';

interface PositionFilterProps {
    position: string;
    handlePositionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PositionFilter: React.FC<PositionFilterProps> = ({ position, handlePositionChange }) => {
    const positionOptions = [
        'Tất cả',
        'Junior',
        'Middle',
        'Senior',
        'Leader',
        'Fresher',
        'Manager',
        'Intern',
    ];

    return (
        <div className={styles.positions}>
            <span>Vị trí</span>
            <div className={styles.list_positions_item}>
                {positionOptions.map((item) => (
                    <div className={styles.positions_item} key={item}>
                        <input
                            type="radio"
                            value={item}
                            checked={position === item}
                            onChange={handlePositionChange}
                        />
                        <label>{item}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PositionFilter;
