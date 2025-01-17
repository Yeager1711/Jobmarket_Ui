'use client';
import React, { useState } from 'react';
import styles from './SalaryGrossNet.module.scss';
import { calculateInsurance } from '../Criteria/utils';
import { calculateIncomeTax } from '../Criteria/taxRules';
import Region_Details from '../../../pages/DefaultLayouts/Popup/Region_Details/page';

import { INSURANCE_RATES, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } from '../Criteria/constants';

interface CalculationResult {
    grossIncome: number;
    socialInsurance: number;
    healthInsurance: number;
    unemploymentInsurance: number;
    preTaxIncome: number;
    incomeTax: number;
    netIncome: number;
    dependentReduction: number;
}

function SalaryGrossNet() {
    // Thu nhập
    const [income, setIncome] = useState<string>('');

    // Số người phụ thuộc
    const [dependents, setDependents] = useState<string>('');

    // Kết quả
    const [result, setResult] = useState<CalculationResult | null>(null);

    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const calculateGrossToNet = () => {
        const grossIncome = parseFloat(income.replaceAll('.', '').replace('đ', '')) || 0;
        const dependentReduction = parseInt(dependents) * DEPENDENT_DEDUCTION || 0;

        // Tính bảo hiểm
        const { socialInsurance, healthInsurance, unemploymentInsurance } = calculateInsurance(grossIncome);

        const preTaxIncome = grossIncome - socialInsurance - healthInsurance - unemploymentInsurance;
        const taxableIncome = Math.max(preTaxIncome - PERSONAL_DEDUCTION - dependentReduction, 0);

        // Thuế thu nhập cá nhân bậc 1 (giả định)
        const incomeTax = calculateIncomeTax(taxableIncome);

        const netIncome = preTaxIncome - incomeTax;

        setResult({
            grossIncome,
            socialInsurance,
            healthInsurance,
            unemploymentInsurance,
            preTaxIncome,
            incomeTax,
            netIncome,
            dependentReduction,
        });
    };

    const calculateNetToGross = () => {
        const netIncome = parseFloat(income.replaceAll('.', '').replace('đ', '')) || 0;

        // Ước tính lương Gross
        let estimatedGross =
            netIncome /
            (1 -
                INSURANCE_RATES.socialInsurance -
                INSURANCE_RATES.healthInsurance -
                INSURANCE_RATES.unemploymentInsurance);

        // Tính bảo hiểm
        const { socialInsurance, healthInsurance, unemploymentInsurance } = calculateInsurance(estimatedGross);

        const dependentReduction = (parseInt(dependents, 10) || 0) * DEPENDENT_DEDUCTION;

        const preTaxIncome = estimatedGross - socialInsurance - healthInsurance - unemploymentInsurance;
        const taxableIncome = Math.max(preTaxIncome - PERSONAL_DEDUCTION - dependentReduction, 0);

        const incomeTax = calculateIncomeTax(taxableIncome);
        const grossIncome = estimatedGross;

        setResult({
            grossIncome: parseFloat(grossIncome.toFixed(0)),
            socialInsurance: parseFloat(socialInsurance.toFixed(0)),
            healthInsurance: parseFloat(healthInsurance.toFixed(0)),
            unemploymentInsurance: parseFloat(unemploymentInsurance.toFixed(0)),
            preTaxIncome: parseFloat(preTaxIncome.toFixed(0)),
            incomeTax: parseFloat(incomeTax.toFixed(0)),
            netIncome: parseFloat(netIncome.toFixed(0)),
            dependentReduction: parseFloat(dependentReduction.toFixed(0)),
        });
    };

    return (
        <section className={styles.SalaryGrossNet}>
            <h3>Lương GROSS - NET</h3>
            <div className={styles.SalaryGrossNet__container}>
                <div className={styles.SalaryGrossNet_temple__left}>
                    <h3>Công thức tính lương GROSS - NET / NET - GROSS</h3>

                    <p className={styles.criteria__GROSS}>
                        Lương Gross = Lương Net + (Tiền BHXH + BHYT + BHTN) + Thuế TNCN (nếu có)
                    </p>

                    <p className={styles.criteria__NET}>
                        {' '}
                        Lương Net = Lương Gross - (Tiền BHXH + BHYT + BHTN) - Thuế TNCN (nếu có)
                    </p>

                    <div className={styles.list_salary}>
                        <div>
                            <p>Lương cơ sở:</p>
                            <span className={styles.text_orange}>2,340,000đ</span>
                        </div>

                        <div>
                            <p>Giảm trừ gia cảnh bản thân:</p>
                            <span className={styles.text_orange}>11,000,000đ</span>
                        </div>

                        <div>
                            <p>Người phụ thuộc:</p>
                            <span className={styles.text_orange}>4,400,000đ</span>
                        </div>
                    </div>

                    <div className={styles.calculator}>
                        <div className={styles.flex_wrap}>
                            <div className={styles.box__input}>
                                <span>Thu Nhập:</span>
                                <input
                                    type="text"
                                    placeholder="VNĐ"
                                    value={income}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Loại bỏ các ký tự không phải số
                                        const formattedValue = new Intl.NumberFormat('vi-VN').format(Number(rawValue)); // Định dạng thành dạng có dấu phẩy
                                        setIncome(formattedValue);
                                    }}
                                />
                            </div>

                            <div className={styles.box__input}>
                                <span>Số người phụ thuộc:</span>
                                <input
                                    type="text"
                                    placeholder="Người"
                                    value={dependents}
                                    onChange={(e) => setDependents(e.target.value)}
                                />
                            </div>

                            <div className={styles.box__input}>
                                <span>
                                    Vùng: <p onClick={() => setIsDetailsVisible(true)}>(Tìm hiểu thêm)</p>
                                </span>
                                <select name="" id="">
                                    <option value="Region_one">Vùng 1</option>
                                    <option value="Region_two">Vùng 2</option>
                                    <option value="Region_three">Vùng 3</option>
                                    <option value="Region_four">Vùng 4</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.convert}>
                            <button className={styles.convert__GROSSNET} onClick={calculateGrossToNet}>
                                GROSS - NET
                            </button>
                            <button className={styles.convert__NETGROSS} onClick={calculateNetToGross}>
                                NET - GROSS
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.SalaryGrossNet_temple__right}>
                    {result ? (
                        <>
                            <div className={styles.result}>
                                <h3>Kết quả</h3>

                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Lương Gross</th>
                                            <th>Bảo hiểm</th>
                                            <th>Thuế TNCN</th>
                                            <th>Lương Net</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{result.grossIncome.toLocaleString()}</td>
                                            <td>
                                                -{' '}
                                                {(
                                                    result.socialInsurance +
                                                    result.healthInsurance +
                                                    result.unemploymentInsurance
                                                ).toLocaleString()}{' '}
                                            </td>
                                            <td> - {result.incomeTax.toLocaleString()}</td>
                                            <td>{result.netIncome.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.result__details}>
                                <h3>Chi tiết tính toán</h3>
                                <table className={styles.table}>
                                    <tbody>
                                        <tr>
                                            <td>Lương GROSS</td>
                                            <td className={styles.netIncome}>{result.grossIncome.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Bảo hiểm xã hội</td>
                                            <td className={styles.netIncome}>
                                                {' '}
                                                - {result.socialInsurance.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Bảo hiểm y tế</td>
                                            <td className={styles.netIncome}>
                                                {' '}
                                                - {result.healthInsurance.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Bảo hiểm thất nghiệp</td>
                                            <td className={styles.netIncome}>
                                                {' '}
                                                - {result.unemploymentInsurance.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Thu nhập trước thuế</td>
                                            <td className={styles.netIncome}>
                                                {result.preTaxIncome.toLocaleString()}{' '}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>Giảm trừ gia cảnh bản thân</td>
                                            <td className={styles.netIncome}>
                                                - {PERSONAL_DEDUCTION.toLocaleString()}{' '}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>Giảm trừ gia cảnh người phụ thuộc</td>
                                            <td className={styles.netIncome}>
                                                - {result.dependentReduction.toLocaleString()}{' '}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>Thuế thu nhập cá nhân</td>
                                            <td className={styles.netIncome}>{result.incomeTax.toLocaleString()} </td>
                                        </tr>
                                        <tr>
                                            <td>Lương NET</td>
                                            <td className={styles.netIncome}>{result.netIncome.toLocaleString()} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.header__content}>
                                <h1>Lương Gross là gì ? </h1>
                                <span>
                                    Lương Gross (Gross Income) là tổng thu nhập mà người lao động nhận được mỗi tháng
                                    bao gồm: lương cơ bản, phụ cấp, thưởng KPI, v.vv... chưa trừ các khoản đóng bảo hiểm
                                    bắt buộc và thuế phải nộp. Lương Gross thường bao gồm: Lương cơ bản, hoa hồng cùng
                                    các khoản trợ cấp khác. Tuy nhiên, lương Gross không phải mức lương thực tế mà người
                                    lao động nhận được. Hàng tháng, người lao động nhận lương Gross sẽ phải trích % tiền
                                    để đóng bảo hiểm và thuế thu nhập cá nhân, mức lương thực nhận được sẽ thấp hơn so
                                    với lương Gross.
                                </span>
                            </div>

                            <div className={styles.header__content}>
                                <h1>Lương NET là gì ? </h1>
                                <span>
                                    Lương Net là lương thực nhận của người lao động sau khi đã trừ hết các khoản bảo
                                    hiểm, thuế thu nhập cá nhân và các chi phí khấu trừ khác. Lương Net sẽ thấp hơn
                                    lương Gross do phải trừ đi các khoản thuế phí.
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {isDetailsVisible && <Region_Details onClose={() => setIsDetailsVisible(false)}/>}
        </section>
    );
}

export default SalaryGrossNet;
