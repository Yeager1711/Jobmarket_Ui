import React from 'react';
import styles from '../jobTag.module.scss';

interface SalaryFilterProps {
    salary: string;
    currency: string;
    salaryFrom: string;
    salaryTo: string;
    handleSalaryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSalaryFromChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSalaryToChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleApplySalary: () => void;
}

const SalaryFilter: React.FC<SalaryFilterProps> = ({
    salary,
    currency,
    salaryFrom,
    salaryTo,
    handleSalaryChange,
    handleCurrencyChange,
    handleSalaryFromChange,
    handleSalaryToChange,
    handleApplySalary,
}) => {
    const salaryOptions = [
        'Tất cả',
        'Thỏa thuận',
        'Dưới 10tr',
        '10 - 20tr',
        '20 - 30tr',
        '30 - 40tr',
        'Trên 40tr',
    ];

    return (
        <div className={styles.salary}>
            <span>Mức lương</span>
            <div>
                <div className={styles.list_salary_item}>
                    {salaryOptions.map((item) => (
                        <div className={styles.salary_item} key={item}>
                            <input
                                type="radio"
                                value={item}
                                checked={salary === item}
                                onChange={handleSalaryChange}
                            />
                            <label>{item}</label>
                        </div>
                    ))}
                </div>

                <div className={styles.box_field__salary}>
                    <div className={styles.currency}>
                        <select value={currency} onChange={handleCurrencyChange} disabled>
                            <option value="VNĐ">VNĐ</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>

                    <div className={styles.flex_currency}>
                        <div className={styles.currency_input}>
                            <input
                                type="text"
                                placeholder="Từ"
                                value={salaryFrom}
                                onChange={handleSalaryFromChange}
                            />
                        </div>
                        {' - '}
                        <div className={styles.currency_input}>
                            <input
                                type="text"
                                placeholder="Đến"
                                value={salaryTo}
                                onChange={handleSalaryToChange}
                            />
                        </div>
                    </div>

                    <div className={styles.apply_currency} onClick={handleApplySalary}>
                        Áp dụng
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryFilter;
