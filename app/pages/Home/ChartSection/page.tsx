import React, { useEffect, useState, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2'; // Import Bar chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary chart elements
import CountUp from 'react-countup';
import styles from './ChartSection.module.scss';
import 'aos/dist/aos.css';
import AOS from 'aos';
import ChartSection_Skeleton from './ChartSection_Sekeleton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';
{
    /* <FontAwesomeIcon icon={faArrowTrendUp} /> */
}
{
    /* <FontAwesomeIcon icon={faArrowTrendDown} /> */
}
// Register the chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

const ChartSection = () => {
    const [dataChart, setDataChart] = useState<{
        totalJobs: number;
        uniqueCompanies: number;
        jobsUpdatedIn48Hours: number;
        totalSalaryAboveThreshold: number;
        totalSalaryAboveThreshold_Upto: number;
        jobsCreatedByDate: { date: string; count: number }[];
        jobIndustries: { name: string; jobCount: number }[];
    } | null>(null);

    const chartRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        AOS.init({ duration: 1200 });
    }, []);

    const optionsLine = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: 'white',
                },
            },
            title: {
                display: true,
                text: 'Cơ hội việc làm',
                color: '#fff',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                },
                grid: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    color: 'white',
                    beginAtZero: true,
                },
                grid: {
                    borderColor: '#fff',
                    color: '#fff',
                    borderDash: [5, 5],
                },
            },
        },
    };
    const optionsBar = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: 'white',
                },
            },
            title: {
                display: true,
                text: 'Nhu cầu tuyển dụng',
                color: '#fff',
            },
        },
        scales: {
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    color: 'white',
                    beginAtZero: true,
                },
                grid: {
                    borderColor: '#dbdbdb',
                    color: '#dbdbdb',
                },
                min: 0,
                stepSize: 25,
            },
        },
        barThickness: 40,
        spacing: 10,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
    };

    const fetchChart = async () => {
        try {
            const response = await fetch(`${apiUrl}/jobs/chart-section`);
            const data = await response.json();

            setDataChart(data.data);
            setLoading(false);
        } catch (err) {
            setError('Có lỗi xảy ra khi lấy dữ liệu');
            setLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        fetchChart();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (chartRef.current) {
            observer.observe(chartRef.current);
        }

        return () => {
            if (chartRef.current) {
                observer.unobserve(chartRef.current);
            }
        };
    }, []);

    // Function to get the last 7 days in order from past to future
    const getLast7Days = () => {
        const days = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            days.push(`${day.getDate()}/${day.getMonth() + 1}`);
        }

        return days.reverse();
    };

    const dataLine1 = dataChart
        ? {
              labels: getLast7Days(),
              datasets: [
                  {
                      label: 'Việc làm 7  ngày qua',
                      data: getLast7Days().map((date) => {
                          // Tìm job count tương ứng với ngày
                          const jobData = dataChart.jobsCreatedByDate.find((job) => {
                              const jobDate = new Date(job.date);
                              return `${jobDate.getDate()}/${jobDate.getMonth() + 1}` === date;
                          });
                          return jobData ? jobData.count : 0; // Nếu không có thì mặc định là 0
                      }),
                      borderColor: '#00A884',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      tension: 0.4,
                  },
              ],
          }
        : {
              labels: [],
              datasets: [],
          };

    const dataBar = dataChart
        ? {
              labels: dataChart.jobIndustries.map((industry) =>
                  industry.name.length > 100 ? industry.name.slice(0, 10) + '...' : industry.name
              ),
              datasets: [
                  {
                      label: 'Số lượng công việc',
                      data: dataChart.jobIndustries.map((industry) => industry.jobCount),
                      backgroundColor: [
                          'rgba(72, 144, 232, 0.9)',
                          'rgba(255, 102, 102, 0.9)',
                          'rgba(102, 204, 102, 0.9)',
                          'rgba(255, 178, 102, 0.9)',
                          'rgba(153, 102, 255, 0.9)',
                          'rgba(255, 223, 102, 0.9)',
                          'rgba(102, 217, 239, 0.9)',
                      ].slice(0, dataChart.jobIndustries.length),
                  },
              ],
          }
        : {
              labels: [],
              datasets: [],
          };

    function formatToVND(salary: number): string {
        if (isNaN(salary)) {
            throw new Error('Invalid number');
        }
        return salary.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    const calculateJobTrend = () => {
        if (!dataChart) return null;
    
        const today = new Date();
        const todayCopy = new Date(today); // Lưu bản sao để không thay đổi today
    
        // Lấy công việc trong ngày hôm nay
        const jobsToday = dataChart.jobsCreatedByDate.filter((job) => {
            const jobDate = new Date(job.date);
            return jobDate.toDateString() === today.toDateString(); // So sánh ngày, bỏ qua giờ
        });
    
        // Lấy 7 ngày trước
        const jobsLast7Days = dataChart.jobsCreatedByDate.filter((job) => {
            const jobDate = new Date(job.date);
            return jobDate <= today && jobDate > new Date(todayCopy.setDate(todayCopy.getDate() - 7));
        });
    
        // Lấy tổng số công việc trong 7 ngày trước
        const totalLast7Days = jobsLast7Days.reduce((sum, job) => sum + job.count, 0);
    
        // Nếu có công việc trong ngày hôm nay, xu hướng sẽ là "tăng"
        if (jobsToday.length > 0) {
            return 'up';
        }
    
        // Nếu không có công việc trong ngày hôm nay và tổng công việc trong 7 ngày trước giảm
        return totalLast7Days > 0 ? 'down' : 'noData';
    };
    

    return (
        <section ref={chartRef} className={styles.HomePage_chart}>
            <div className={styles.HomePage_container}>
                {loading ? (
                    <ChartSection_Skeleton />
                ) : error ? (
                    <div className={styles.error_message}>{error}</div>
                ) : dataChart ? (
                    <>
                        <div className={styles.image__pic}>
                            <h3>
                                Thị trường hôm nay
                                <p>{`${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`}</p>
                            </h3>

                            <img src="/images/pic.jpg" alt="Explore Jobs" />

                            <div className={styles.total_salary__VND} data-aos="fade-down" data-aos-delay="200">
                                <CountUp
                                    start={0}
                                    end={dataChart.totalSalaryAboveThreshold}
                                    duration={3}
                                    separator=","
                                    redraw
                                />{' '}
                                VNĐ
                                <p>Tổng Offer lương được đưa ra theo VNĐ</p>
                            </div>

                            <div className={styles.total_salary__USD} data-aos="fade-right" data-aos-delay="400">
                                Thỏa thuận
                                <p>Mức lương phù hợp với năng lực bản thân và nhu cầu nhà tuyển dụng.</p>
                            </div>

                            <div className={styles.total_salary__upTo} data-aos="fade-up-left" data-aos-delay="600">
                                <CountUp
                                    start={0}
                                    end={dataChart.totalSalaryAboveThreshold_Upto}
                                    duration={3}
                                    separator=","
                                    redraw
                                />{' '}
                                VNĐ
                                <p>Tổng Up To lương</p>
                            </div>
                        </div>

                        <div className={styles.content_HomePage_chart}>
                            <div className={styles.wrapper_totalItems}>
                                <div className={styles.total_items}>
                                    <CountUp
                                        start={0}
                                        end={dataChart.jobsUpdatedIn48Hours}
                                        duration={3}
                                        separator=","
                                        redraw
                                    />
                                    <p>Việc làm mới 7 ngày qua</p>
                                </div>
                                <div className={styles.total_items}>
                                    <CountUp start={0} end={dataChart.totalJobs} duration={3} separator="," redraw />
                                    <p>
                                        Việc làm đang tuyển{' '}
                                        <span className={styles.trend__jobs}>
                                            <FontAwesomeIcon
                                                icon={calculateJobTrend() === 'up' ? faArrowTrendUp : faArrowTrendDown}
                                            />
                                        </span>
                                    </p>
                                </div>
                                <div className={styles.total_items}>
                                    <CountUp
                                        start={0}
                                        end={dataChart.uniqueCompanies}
                                        duration={3}
                                        separator=","
                                        redraw
                                    />
                                    <p>Công ty đang tuyển</p>
                                </div>
                            </div>
                            <div className={styles.wrapper_chart}>
                                <div className={styles.chart_items}>
                                    <h3>Cơ hội việc làm</h3>
                                    <Line data={dataLine1} options={optionsLine} />
                                </div>
                                <div className={styles.chart_items}>
                                    <h3>Nhu cầu tuyển dụng</h3>
                                    <Bar data={dataBar} options={optionsBar} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </section>
    );
};

export default ChartSection;
