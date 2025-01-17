import { INSURANCE_RATES, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION, BASE_SALARY, MINIMUM } from './constants';
import { REGION_MIN_SALARY } from './region';

interface TaxInput {
    grossIncome: number;
    dependents: number;
    region: keyof typeof REGION_MIN_SALARY;
}

export const calculatePersonalTax = ({ grossIncome, dependents, region }: TaxInput) => {
    let socialInsurance = 0;
    let healthInsurance = 0;
    let unemploymentInsurance = 0;
    const regionSalaryCap = REGION_MIN_SALARY[region] * 20;
    // const regionSalaryCap = REGION_MIN_SALARY[region as keyof typeof REGION_MIN_SALARY] * 20;


    // Nếu grossIncome > BASE_SALARY * MINIMUM, áp dụng mức lương trần để tính bảo hiểm
    if (grossIncome > BASE_SALARY * MINIMUM) {
        socialInsurance = BASE_SALARY * MINIMUM * INSURANCE_RATES.socialInsurance; // BHXH
        healthInsurance = BASE_SALARY * MINIMUM * INSURANCE_RATES.healthInsurance; // BHYT
        // BHTN giới hạn bởi trần vùng (20 lần mức lương tối thiểu vùng)
        unemploymentInsurance = Math.min(grossIncome, regionSalaryCap) * INSURANCE_RATES.unemploymentInsurance;
    } else {
        socialInsurance = grossIncome * INSURANCE_RATES.socialInsurance;
        healthInsurance = grossIncome * INSURANCE_RATES.healthInsurance;
        unemploymentInsurance = grossIncome * INSURANCE_RATES.unemploymentInsurance;
    }

    // Tổng bảo hiểm
    const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

    // Thu nhập trước thuế
    const preTaxIncome = grossIncome - totalInsurance;

    // Giảm trừ gia cảnh
    const totalDeductions = PERSONAL_DEDUCTION + dependents * DEPENDENT_DEDUCTION;

    // Thu nhập chịu thuế
    const taxableIncome = Math.max(preTaxIncome - totalDeductions, 0);

    // Tính thuế TNCN
    const incomeTax = calculateIncomeTax(taxableIncome);

    // Kết quả
    return {
        grossIncome,
        socialInsurance,
        healthInsurance,
        unemploymentInsurance,
        preTaxIncome,
        totalDeductions,
        taxableIncome,
        incomeTax: incomeTax.tax, // Extract the total tax
        taxDetails: incomeTax.taxDetails, // Include tax breakdown details
    };
};

// Bảng tính thuế theo lũy tiến
const TAX_BRACKETS = [
    { threshold: 5000000, rate: 0.05 },
    { threshold: 10000000, rate: 0.1 },
    { threshold: 18000000, rate: 0.15 },
    { threshold: 32000000, rate: 0.2 },
    { threshold: 52000000, rate: 0.25 },
    { threshold: 80000000, rate: 0.3 },
    { threshold: Infinity, rate: 0.35 },
];

const calculateIncomeTax = (taxableIncome: number): { tax: number; taxDetails: any[] } => {
    let tax = 0;
    let lowerBound = 0;
    const taxDetails: any[] = [];

    for (const bracket of TAX_BRACKETS) {
        if (taxableIncome <= lowerBound) break;

        const taxableAmount = Math.min(taxableIncome, bracket.threshold) - lowerBound;
        const bracketTax = taxableAmount * bracket.rate;
        tax += bracketTax;

        // Push structured data into taxDetails array
        taxDetails.push({
            taxRange:
                bracket.threshold <= 5000000
                    ? `Đến ${bracket.threshold.toLocaleString()} VNĐ`
                    : `Trên ${lowerBound.toLocaleString()} VNĐ đến ${bracket.threshold.toLocaleString()} VNĐ`,
            taxRate: (bracket.rate * 100).toFixed(0), // Percentage of the tax rate
            taxAmount: bracketTax,
        });

        lowerBound = bracket.threshold;
    }

    return {
        tax: Math.round(tax),
        taxDetails,
    };
};
