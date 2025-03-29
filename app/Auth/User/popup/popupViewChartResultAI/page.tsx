// PopupViewChartResultAI.tsx
import React, { useEffect, useState } from 'react';
import styles from './popupViewChartResultAI.module.scss';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ChartData {
    suitability: number;
    technicalStrength: number;
    experienceStrength: number;
    softSkillsStrength: number;
    education: number;
    practicalExperience: number;
    jobRequirementComparison: number;
    candidateComparison: number;
}

interface PopupViewChartResultAIProps {
    onClose: () => void;
    isOpen: boolean;
    chartData: ChartData;
}

const PopupViewChartResultAI: React.FC<PopupViewChartResultAIProps> = ({ onClose, isOpen, chartData }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setIsExpanded(true);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setIsExpanded(false);
        }
    }, [isOpen]);

    const radarData = {
        labels: [
            'Mức độ phù hợp',
            'Kỹ thuật',
            'Kinh nghiệm',
            'Kỹ năng mềm',
            'Học vấn',
            'Thực tế',
            'Yêu cầu công việc',
            'So với ứng viên khác',
        ],
        datasets: [
            {
                label: 'Phân tích mức độ phù hợp',
                data: [
                    chartData.suitability,
                    chartData.technicalStrength,
                    chartData.experienceStrength,
                    chartData.softSkillsStrength,
                    chartData.education,
                    chartData.practicalExperience,
                    chartData.jobRequirementComparison,
                    chartData.candidateComparison,
                ],
                backgroundColor: 'rgba(0, 255, 153, 0.2)',
                borderColor: 'rgba(0, 255, 153, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(0, 255, 153, 1)',
                pointBorderColor: '#fff',
                pointRadius: 4,
                animation: {
                    duration: 100,
                },
            },
        ],
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: '#6f6f6f',
                    lineWidth: 2,
                },
                grid: {
                    color: '#6f6f6f',
                    lineWidth: 2,
                },
                ticks: {
                    display: false,
                    stepSize: 20,
                },
                pointLabels: {
                    font: {
                        size: 14,
                        family: 'Arial',
                    },
                    color: '#ffffff',
                    padding: 20,
                },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff',
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                titleFont: {
                    size: 14,
                },
                bodyFont: {
                    size: 12,
                },
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
            },
        },
        animation: {
            duration: 100,
        },
    };

    const suitabilityData = [
        { label: 'Kỹ thuật', value: chartData.technicalStrength, color: '#00FFB3' }, // Màu xanh nhạt
        { label: 'Kinh nghiệm', value: chartData.experienceStrength, color: '#FF6F61' }, // Màu đỏ cam
        { label: 'Kỹ năng mềm', value: chartData.softSkillsStrength, color: '#FFD700' }, // Màu vàng
        { label: 'Học vấn', value: chartData.education, color: '#00CED1' }, // Màu xanh lam
        { label: 'Thực tế', value: chartData.practicalExperience, color: '#FF4500' }, // Màu cam đậm
        { label: 'Yêu cầu công việc', value: chartData.jobRequirementComparison, color: '#ADFF2F' }, // Màu xanh lá
        { label: 'So với ứng viên khác', value: chartData.candidateComparison, color: '#FF69B4' }, // Màu hồng
    ];

    const suitabilityPercentage = chartData.suitability;

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={`${styles.popup} ${isExpanded ? styles.expanded : ''}`}>
                <div className={styles.header}>
                    <h3>Biểu đồ phân tích mức độ phù hợp của bạn với công việc</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className={styles.content}>
                    <div className={`${styles.chartContainer} ${isExpanded ? styles.chartExpanded : ''}`}>
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                    <div className={styles.detailsContainer}>
                        <div className={styles.suitabilityCircle}>
                            <div>
                                <h3>Đánh giá mức độ phù hợp </h3>
                                <span>Thực hiện bởi JobMarket AI</span>
                            </div>
                            <div>
                                <svg className={styles.circularProgress} width="120" height="120" viewBox="0 0 120 120">
                                    <circle
                                        className={styles.progressBackground}
                                        cx="60"
                                        cy="60"
                                        r="55"
                                        strokeWidth="10"
                                    />
                                    <circle
                                        className={styles.progressFill}
                                        cx="60"
                                        cy="60"
                                        r="55"
                                        strokeWidth="20"
                                        style={{
                                            strokeDasharray: 345,
                                            strokeDashoffset: 345 - (345 * suitabilityPercentage) / 100,
                                        }}
                                    />
                                    <text x="60" y="60" textAnchor="middle" dy=".3em" className={styles.progressValue}>
                                        {suitabilityPercentage}%
                                    </text>
                                </svg>
                            </div>
                        </div>
                        <div className={styles.sliders}>
                            {suitabilityData.map((item, index) => (
                                <div key={index} className={styles.sliderItem}>
                                    <label>{item.label}</label>
                                    <div className={styles.slider}>
                                        <div
                                            className={styles.sliderFill}
                                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                        ></div>
                                        <span className={styles.sliderValue}>{item.value}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupViewChartResultAI;
