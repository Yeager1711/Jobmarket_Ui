'use client';
import React, { useRef, useState } from 'react';
import styles from './CompoundInterest.module.scss';
import { showToastError, showToastSuccess } from '../../../Ultils/toast';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const emailDefault_contract = process.env.NEXT_PUBLIC_APP_EMAIL;

function CompoundInterest() {
    const [initialAmount, setInitialAmount] = useState<string>(''); // Số tiền ban đầu
    const [monthlyContribution, setMonthlyContribution] = useState<string>(''); // Số tiền mỗi tháng
    const [years, setYears] = useState<string>(''); // Thời gian gửi (Năm)
    const [interestRate, setInterestRate] = useState<string>(''); // Lãi suất
    const [results, setResults] = useState<any[]>([]); // Kết quả tính toán
    const [finalFutureValue, setFinalFutureValue] = useState<string>('');
    const [showResults, setShowResults] = useState(false);
    const resultsRef = useRef<HTMLDivElement | null>(null);

    // xử lý input nhập vào fortmat VNĐ
    const formatCurrency = (value: string): string => {
        // Xóa mọi ký tự không phải số
        const numericValue = value.replace(/\D/g, '');
        // Thêm dấu phẩy phân cách hàng nghìn
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleInitialAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCurrency(e.target.value);
        setInitialAmount(formattedValue);
    };

    const handleMonthlyContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCurrency(e.target.value);
        setMonthlyContribution(formattedValue);
    };

    // ==================================================================================

    const handleCalculate = () => {
        const P = parseFloat(initialAmount.replace(/,/g, '')) || 0; // Tiền gốc
        const PMT = parseFloat(monthlyContribution.replace(/,/g, '')) * 12 || 0; // Đóng góp hàng năm
        const n = parseInt(years) || 0; // Số năm
        const r = (parseFloat(interestRate) || 0) / 100; // Lãi suất (dạng thập phân)

        const calculatedResults = [];
        let cumulativeContribution = P; // Tổng đóng góp trong năm
        let futureValue = 0;

        for (let i = 0; i <= n; i++) {
            if (i > 0) {
                cumulativeContribution += PMT; // Cộng dồn tiền đóng góp hàng năm
            }

            // Tính tổng giá trị tương lai
            futureValue = P * Math.pow(1 + r, i) + PMT * ((Math.pow(1 + r, i) - 1) / r);

            calculatedResults.push({
                year: i,
                cumulativeContribution: cumulativeContribution.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                futureValue: futureValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            });
        }

        setResults(calculatedResults); // Cập nhật kết quả tính toán
        // Lưu giá trị tương lai cuối cùng
        setFinalFutureValue(futureValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        setShowResults(true);

        // Cuộn xuống phần kết quả
        setTimeout(() => {
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    // ========= Show Toast Error ValidDate ================
    const [toastShown, setToastShown] = useState<{ years: boolean; interestRate: boolean }>({
        years: false,
        interestRate: false,
    });

    const isFormValid = () => {
        const yearsValue = parseInt(years);
        const interestRateValue = parseFloat(interestRate);

        // Validate years
        if (yearsValue < 1 || yearsValue === 0) {
            // Only show the toast if it hasn't been shown yet
            if (!toastShown.years) {
                showToastError('Năm ít nhất bằng 1');
                setToastShown((prevState) => ({ ...prevState, years: true }));
            }
            return false;
        }

        if (yearsValue > 100) {
            // Only show the toast if it hasn't been shown yet
            if (!toastShown.years) {
                showToastError('Không quá 100 năm');
                setToastShown((prevState) => ({ ...prevState, years: true }));
            }
            return false;
        }

        // Validate interestRate
        if (interestRateValue < 1 || interestRateValue === 0) {
            // Only show the toast if it hasn't been shown yet
            if (!toastShown.interestRate) {
                showToastError('Lãi suất lớn hơn 0');
                setToastShown((prevState) => ({ ...prevState, interestRate: true }));
            }
            return false;
        }

        // Check if all fields are filled
        return (
            initialAmount.trim() !== '' &&
            monthlyContribution.trim() !== '' &&
            years.trim() !== '' &&
            interestRate.trim() !== ''
        );
    };

    // ============= Control Character input ==============
    const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let yearValue = e.target.value.trim();

        // Remove any non-numeric characters, leaving only the numbers
        yearValue = yearValue.replace(/\D/g, '');

        // If there is a numeric value, append ' Năm' to it
        if (yearValue && !isNaN(Number(yearValue))) {
            setYears(`${yearValue} Năm`);
        } else {
            setYears(''); // Clear if the input is invalid or empty
        }
    };

    const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let interestRateValue = e.target.value.trim();

        // Remove any non-numeric characters, leaving only the numbers
        interestRateValue = interestRateValue.replace(/\D/g, '');

        // If there is a numeric value, append ' Năm' to it
        if (interestRateValue && !isNaN(Number(interestRateValue))) {
            setInterestRate(`${interestRateValue} %`);
        } else {
            setInterestRate(''); // Clear if the input is invalid or empty
        }
    };

    //================== Chart =========================
    const chartData = {
        labels: results.map((result) => 'Năm' + ' ' + result.year), // Labels cho trục X (năm)
        datasets: [
            {
                label: 'Tiền Gốc (VNĐ)',
                data: results.map((result) => parseFloat(result.cumulativeContribution.replace(/,/g, ''))), // Dữ liệu cho tiền gốc
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                fill: false, // Không tô màu dưới đường
            },
            {
                label: 'Giá Trị Tương Lai (VNĐ)',
                data: results.map((result) => parseFloat(result.futureValue.replace(/,/g, ''))), // Dữ liệu cho giá trị tương lai
                borderColor: 'rgba(153,102,255,1)',
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    return (
        <section className={styles.CompoundInterest}>
            <div className={styles.row}>
                <div className={styles.CompoundInterest_tool}>
                    <div className={styles.box}>
                        <h1>Công cụ tính Lãi Kép, Giá trị tiền gửi, Lợi nhuận đầu tư</h1>
                        <p>
                            Công cụ ứng dụng lãi suất kép để tính toán tiền gửi, lợi nhuận đầu tư thu được trong tương
                            lai dựa trên kế hoạch tiết kiệm, đầu tư hàng tháng và lãi suất kỳ vọng hoàn toàn miễn phí
                            trên <a href="#">JobMarket</a>.
                        </p>

                        <div className={styles.form}>
                            <div className={styles.form_content}>
                                <h2>Đầu tư ban đầu</h2>

                                <div className={styles.form_group__custom}>
                                    <div className={styles.d_block}>
                                        <span>Số tiền gốc ban đầu (VNĐ)</span>
                                        <p>Số tiền bạn có sẵn để đầu tư ban đầu.</p>
                                    </div>
                                    <div className={styles.input_data}>
                                        <input
                                            type="text"
                                            value={initialAmount}
                                            onChange={handleInitialAmountChange}
                                            placeholder="VD: 5,000,000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.form_content}>
                                <h2>Khoản đóng góp</h2>

                                <div className={styles.form_group__custom}>
                                    <div className={styles.d_flex}>
                                        <div className={styles.d_block}>
                                            <span>Số tiền gửi mỗi tháng (VNĐ)</span>
                                            <p>Số tiền bạn định thêm vào tiền gốc hàng tháng.</p>
                                        </div>
                                        <div className={styles.input_data}>
                                            <input
                                                type="text"
                                                value={monthlyContribution}
                                                onChange={handleMonthlyContributionChange}
                                                placeholder="VD: 5,000,000"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.d_flex}>
                                        <div className={styles.d_block}>
                                            <span>Thời gian gửi (Năm)</span>
                                            <p>Khoảng thời gian, tính bằng năm, mà bạn dự định tiết kiệm.</p>
                                        </div>
                                        <div className={styles.input_data}>
                                            <input
                                                type="text"
                                                value={years}
                                                onChange={handleYearsChange}
                                                placeholder="VD: 10 (năm)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.form_content}>
                                <h2>Lãi suất</h2>

                                <div className={styles.form_group__custom}>
                                    <div className={styles.d_block}>
                                        <span>Lãi suất (%)</span>
                                        <p>Lãi suất ước tính theo kỳ hạn gửi của bạn.</p>
                                    </div>
                                    <div className={styles.input_data}>
                                        <input
                                            type="text"
                                            value={interestRate}
                                            onChange={handleInterestRateChange}
                                            placeholder="VD: 10(%)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.form_content}>
                                <h2>Kỳ hạn</h2>

                                <div className={styles.form_group__custom}>
                                    <div className={styles.d_block}>
                                        <span>Định kỳ gửi</span>
                                        <p>Kỳ hạn nhận lãi tiền gửi của bạn.</p>
                                    </div>
                                    <div className={styles.input_data}>
                                        <select name="" id="" disabled>
                                            {/* <option value="Hàng ngày">Hàng ngày</option>
                                            <option value="Hàng tháng">Hàng tháng</option> */}
                                            <option value="Hàng Năm">Hàng năm</option>
                                            {/* <option value="Hàng Quý">Hàng quý</option> */}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={styles.btn_Calculator}
                                onClick={handleCalculate}
                                disabled={!isFormValid()}
                            >
                                Tính Lãi Suất Kép
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.CompoundInterest_ads}>
                    <div className={styles.box}>
                        <div className={styles.image}>
                            <img src="/images/tuyen-dung_2.jpg" alt="" />

                            <div className={styles.content}>
                                <span>
                                    Đăng tin miễn phí <p>& Tìm kiếm ứng viên</p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.box}>
                        <h3>Công cụ hỗ trợ liên quan</h3>

                        <div className={styles.related_tools}>
                            <a href="">Tính lương GROSS - NET</a>
                            <a href="">Tính thuế thu nhập cá nhân</a>
                            <a href="">Tính Bảo Hiểm thất nghiệp</a>
                            <a href="">Lập kế hoạch tiết kiệm</a>
                            <a href="">Tính Bảo Hiểm xã hội 1 lần</a>
                        </div>
                    </div>
                    <div className={styles.box}>
                        <h3>Hỗ trợ</h3>

                        <div className={styles.support}>
                            <span>
                                Bạn có chia sẻ hay cần tư vấn về cách <p>tính lãi suất kép?</p>
                            </span>
                            <span>
                                Hãy gửi email đề xuất tới{' '}
                                <a href={`mailto:${emailDefault_contract}`}>{emailDefault_contract}</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {showResults && (
                <div ref={resultsRef} className={styles.results}>
                    <div className={styles.chart_result}>
                        <div style={{ marginTop: '2rem' }}>
                            <h2>
                                Giá trị tiền gửi của bạn sẽ là <span>{finalFutureValue} (VNĐ)</span> sau{' '}
                                <span>{years}</span>, với số tiền gốc ban đầu <span>{initialAmount} (VNĐ)</span>, định
                                kỳ mỗi tháng thêm vào tiền gốc <span>{monthlyContribution} (VNĐ)</span> và lãi suất ước
                                tính là <span>{interestRate}/năm</span>
                            </h2>
                        </div>
                        <Line
                            data={chartData}
                            options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
                        />
                    </div>
                    <div className={styles.table_result__details}>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <span className={styles.d_block}>Năm</span>
                                        <span className={styles.d_block__text}>(Tổng {years} )</span>
                                    </th>
                                    <th>
                                        <span className={styles.d_block}>Tiền gốc theo (VNĐ)</span>
                                        <span className={styles.d_block__text}>(Tiền đóng góp lũy kế hàng năm)</span>
                                    </th>
                                    <th>
                                        <span className={styles.d_block}>Giá trị tương lai (VNĐ)</span>
                                        <span className={styles.d_block__text}>
                                            (Lãi suất kỳ vọng {interestRate}/ năm)
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result) => (
                                    <tr key={result.year}>
                                        <td>{result.year}</td>
                                        <td>{formatCurrency(result.cumulativeContribution)}</td>
                                        <td>{formatCurrency(result.futureValue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className={styles.Related_toolsOfInterest}>
                <span>
                    Có thể bạn quan tâm{' '}
                    <a href="/OutstandingTool/Details/Savings__Plan">
                        Công cụ lập kế hoạch tiết kiệm ứng dụng lãi suất kép miễn phí chính xác nhất
                    </a>
                </span>
            </div>

            <div className={styles.box_content}>
                <div className={styles.content}>
                    <h3>Công cụ tính lãi suất kép</h3>
                    <p>
                        Lãi suất kép trong tiếng Anh là Compound Interest, được Einstein nhận định là “kỳ quan thứ 8 của
                        thế giới. Những ai hiểu được nó từ đó sẽ kiếm được tiền, ai không hiểu sẽ phải trả chi phí cho
                        điều đó”. “Thiên tài đầu tư” Warren Buffett cũng từng chia sẻ lý do mà ông giàu có: “Sự giàu có
                        của tôi kết hợp từ cuộc sống tại Mỹ, gen tốt và Lãi suất kép”.
                    </p>
                    <p>
                        Bạn hoàn toàn có thể trở nên giàu có như Warren Buffett nếu bạn biết tận dụng sức mạnh của lãi
                        kép, kết hợp với việc đầu tư thường xuyên, nhất quán trong một thời gian dài. Công cụ tính lãi
                        suất kép của TopCV dưới đây sẽ giúp bạn tính toán và dự báo được sự tăng trưởng kép "khối tài
                        sản" (khoản gửi tiết kiệm, đầu tư) của mình trong một thời gian nhất định.
                    </p>
                </div>

                <div className={styles.content}>
                    <h3>Lãi suất kép là gì?</h3>
                    <p>
                        Lãi suất kép (lãi kép) hay còn được gọi là lãi cộng dồn, có nghĩa là khi đến kỳ nhận lãi của
                        khoản đầu tư thì bạn lấy lãi đó nhập vào thành gốc và tiếp tục đầu tư chuỗi chu kỳ tiếp theo. Cứ
                        lặp đi lặp lại như vậy xuyên suốt thời gian đầu tư hoặc gửi tiết kiệm thì được coi là lãi suất
                        kép.
                    </p>
                </div>

                <div className={styles.content}>
                    <h2>Công thức tính lãi suất kép trong toán học</h2>

                    <span>
                        Công thức: <p>Fₙ = P * (1 + i/m)^(n * m)</p>
                    </span>

                    <img src="/images/ct.jpg" alt="" />

                    <p>Công thức tính lãi suất kép</p>
                    <p>Trong đó:</p>
                    <p> * Fn là giá trị của khoản đầu tư trong khoảng thời gian n năm mà bạn nhận được.</p>
                    <p> * P là giá trị khoản đầu tư hiện tại của bạn.</p>
                    <p>
                        {' '}
                        * i là lãi suất hàng năm của khoản đầu tư đó. Ví dụ lãi suất 10%/năm, thì i được hiểu là 0,1.
                    </p>
                    <p> * n là số năm bạn dự tính đầu tư.</p>
                    <p> * m là số lần ghép lãi trong 1 năm, nếu lãi nhận hàng năm thì m là 1.</p>
                </div>
                <div className={styles.content}>
                    <h2>Sức mạnh của lãi suất kép</h2>
                    <p>Bạn đang có trong tay 100 triệu. Bạn muốn đầu tư với lãi suất 8%/năm.</p>
                    <p>
                        Nếu áp dụng lãi đơn, sau 5 năm bạn nhận được: 100 * (1 + 8%*5) = 140 triệu đồng. Số tiền này còn
                        cao hơn khi bạn sử dụng công thức lãi kép như sau: 100 * (1 + 8%)^5 = 146,93 triệu đồng.
                    </p>

                    <p>Sức mạnh của lãi kép trở nên rõ ràng hơn khi bạn nhìn vào biểu đồ tăng trưởng dài hạn dưới đây:</p>

                    <img className={styles.image_1} src="/images/bieu-do-tang-truong-lai-kep66d82de32fac7.jpg" alt="" />

                    <p>Sức mạnh của lãi suất kép</p>
                    <p>Đây là biểu đồ ví dụ về khoản đầu tư $1000 ban đầu. Giả thiết thời gian đầu tư là 20 năm ở mức 10% mỗi năm. Khi so sánh lợi ích của lãi suất kép so với lãi suất đơn hay không có lãi suất nào, rõ ràng là chúng ta có thể thấy lãi suất kép có thể giúp tăng giá trị đầu tư của bạn như thế nào.</p>
                    <p>Vì vậy, so với lãi đơn thì lãi kép có sức mạnh kì diệu hơn hẳn và đem lại cho chúng ta mức lợi nhuận cao hơn cùng một khoản đầu tư.</p>
                    <p>Nếu công thức trên khá phức tạp với bạn, sử dụng ngay công cụ tính lãi kép từ TopCV. Bạn chỉ cần nhập số liệu, hệ thống sẽ đưa ra kết quả cuối cùng.</p>
                
                </div>

                <div className={styles.content}>
                    <h1>Câu hỏi thường gặp</h1>

                    <h3>Mức lãi suất là bao nhiêu?</h3>
                    <p>Lãi suất là tỷ lệ mà theo đó tiền lãi được người vay trả cho việc sử dụng tiền mà họ vay từ người cho vay. Tùy vào chính sách của mỗi ngân hàng hay đơn vị/tổ chức tài chính sẽ có mức lãi suất khác nhau. Nếu bạn gửi tiết kiệm - tức là bạn đang cho ngân hàng vay tạm thì lãi suất càng cao càng có lợi cho bạn. Tham khảo càng nhiều ngân hàng hay gói tiết kiệm / đầu tư để lựa chọn được nơi gửi tiết kiệm / đầu tư hiệu quả nhất.</p>
                </div>

                <div className={styles.content}>
                  
                    <h3>Lãi suất hàng năm, hàng tháng là gì?</h3>
                    <p>Với dịch vụ gửi tiết kiệm có kỳ hạn, số tiền gửi sẽ được quy định một mức kỳ hạn đi kèm với mức lãi suất cam kết. Ngân hàng sẽ đưa ra nhiều mức kỳ hạn khác nhau cho khách hàng lựa chọn theo nhu cầu, ví dụ gửi tiết kiệm hàng tháng, quý, năm,… Công cụ tính lãi kép của TopCV bao gồm 2 tùy chọn đơn vị lãi kép phổ biến nhất đó là theo năm và theo tháng.</p>
                </div>
            </div>
        </section>
    );
}

export default CompoundInterest;
