'use client';
import { useState, useEffect } from 'react';
import styles from './compareCompetitiveness.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ResultCompareCompetitiveness = () => {
    // State để lưu kết quả từ API và nội dung đang gõ
    const [result, setResult] = useState<string | null>(null);
    const [typedText, setTypedText] = useState<string>('');

    // Giả lập dữ liệu từ log (thay thế bằng API call thực tế nếu cần)
    useEffect(() => {
        const mockResult = `
                  Chào bạn! Mình là AI của JobMarket, sẽ giúp Huỳnh Nam so sánh mức độ cạnh tranh với các ứng viên khác cho công việc "Automation Quality Assurance" (ID: 2035121).

        🌟 **Thông tin CV của Huỳnh Nam:**


        🎯 **Yêu cầu công việc:**
        Working closely with other QA, engineers, analysts, and product owners to identify testing areas across the deliverables. 
Writing, executing, and maintaining test scripts for automation testing. 
Running and analyzing automa...
[compareCompetitiveness] Response from Gemini: Chào Huỳnh Nam! Mình thấy bạn đang quan tâm đến vị trí Automation Quality Assurance (ID: 2035121) đấy nhé! Để mình giúp bạn phân tích tình hình cạnh tranh nha.

**1. Đánh giá mức độ phù hợp của Huỳnh Nam (thang điểm 100%):**

Dựa trên những thông tin bạn cung cấp về kỹ năng và kinh nghiệm, mình đánh giá mức độ phù hợp của bạn với công việc này khoảng **70-80%**.  Bạn có kinh nghiệm thực tế với Automation Testing, Selenium, Java, TestNG, API Testing, CI/CD, Git,  và Agile, những điều này rất quan trọng cho vị trí này. Việc bạn đã từng xây dựng framework từ đầu cũng là một điểm cộng lớn. Tuy nhiên, mình chưa có thông tin về học vấn của bạn, nên điểm số có thể thay đổi một chút nếu có thêm thông tin này.

**2. So sánh mức độ cạnh tranh:**

So với hai ứng viên kia, bạn có lợi thế cạnh tranh rõ rệt. Cụ thể như sau:

* **Huỳnh Nam (Điểm mạnh):** Kinh nghiệm thực tế về Automation Testing, thành thạo các công cụ và framework cần thiết (Selenium, Java, TestNG, API Testing, CI/CD, Git),  đã từng xây dựng framework từ đầu, làm việc theo Agile.
* **Huỳnh Nam (Điểm yếu):**  Chưa rõ thông tin học vấn.  Cần bổ sung thêm thông tin về các dự án đã tham gia,  đóng góp cụ thể, và kết quả đạt được để làm nổi bật kinh nghiệm của mình.
* **Ứng viên 1 (Huỳnh Thoại):**  Chưa có thông tin gì nhiều ngoài việc là Thực tập sinh/Sinh viên. Rất khó để đánh giá khả năng cạnh tranh của ứng viên này.  Có thể ứng viên này mới bắt đầu sự nghiệp và đang tìm kiếm cơ hội thực tập.

**3. Gợi ý cải thiện cho Huỳnh Nam:**

Để nâng cao khả năng cạnh tranh và tiến gần hơn đến mức 100%, mình có vài gợi ý nho nhỏ cho bạn nè:

* **Bổ sung thông tin học vấn:** Nếu bạn có bằng cấp liên quan đến CNTT, hãy bổ sung vào CV nhé.
* **Chi tiết hóa kinh nghiệm:** Mô tả rõ hơn về các dự án bạn đã tham gia, vai trò của bạn trong dự án, những công nghệ bạn sử dụng, và kết quả đạt được.  Ví dụ, thay vì chỉ ghi "Xây dựng framework automation testing", hãy viết "Xây dựng framework automation testing từ đầu sử dụng Selenium và Java, giúp giảm thời gian test regression xuống 50%".  Số liệu cụ thể sẽ gây ấn tượng mạnh hơn với nhà tuyển dụng.
* **Nắm rõ yêu cầu công việc:**  Đọc kỹ mô tả công việc và điều chỉnh CV,  thư xin việc sao cho phù hợp.  Nhấn mạnh những kỹ năng và kinh nghiệm đáp ứng đúng yêu cầu của nhà tuyển dụng.
* **Trau dồi thêm kỹ năng:**  Công nghệ luôn thay đổi,  vì vậy hãy liên tục học hỏi và cập nhật kiến thức về các công cụ và framework mới.  Bạn có thể tìm hiểu thêm về các framework automation testing phổ biến khác, hoặc các công cụ hỗ trợ CI/CD.
* **Chuẩn bị cho buổi phỏng vấn:**  Nghiên cứu kỹ về công ty và vị trí ứng tuyển.  Luyện tập trả lời các câu hỏi phỏng vấn thường gặp.

Mình tin rằng với những kinh nghiệm và kỹ năng hiện có, cùng với một chút tinh chỉnh, bạn hoàn toàn có thể chinh phục vị trí Automation Quality Assurance này. Chúc bạn may mắn nhé!  Nếu có bất kỳ thắc mắc nào, đừng ngần ngại hỏi mình nha!
        `;
        setResult(mockResult);

        // Hiệu ứng gõ tay
        let index = 0;
        const interval = setInterval(() => {
            if (index < mockResult.length) {
                setTypedText((prev) => prev + mockResult.charAt(index));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 10); // Tốc độ gõ (10ms mỗi ký tự)

        return () => clearInterval(interval); // Dọn dẹp interval khi unmount
    }, []);

    // Hàm để phân tích và hiển thị gợi ý cải thiện
    const getSuggestions = (text: string) => {
        const suggestionSection = text.split('**3. Gợi ý cải thiện:**')[1]?.split('Chúc bạn may mắn')[0]?.trim();
        if (!suggestionSection) return [];
        return suggestionSection
            .split('-')
            .map((item) => item.trim())
            .filter((item) => item);
    };

    // Kiểm tra xem hiệu ứng gõ tay đã hoàn tất chưa
    const isTypingComplete = typedText === result;

    return (
        <section className={styles.resultContainer}>
            {/* Header */}
            <div className={styles.header}>
                <h1>Kết quả so sánh mức độ cạnh tranh</h1>
                <p>
                    Công việc: <strong>Automation Quality Assurance</strong> (ID: 2035121)
                </p>
                <p>
                    Tổng ứng viên: <strong>2</strong>
                </p>
            </div>

            {/* AI Message Section */}
            {result ? (
                <div className={styles.aiMessage}>
                    <div className={styles.AI_border}>
                        <div className={styles.aiAvatar}>
                            <span>AI</span>
                        </div>
                        <div className={styles.aiContent}>
                            {/* Hiển thị nội dung với hiệu ứng gõ tay */}
                            <div className={styles.typingText}>
                                {typedText
                                    .split('\n')
                                    .map((line, index) =>
                                        line.trim() ? (
                                            <p key={index}>
                                                {line.includes('**') ? (
                                                    <strong>{line.replace(/\*\*/g, '')}</strong>
                                                ) : (
                                                    line
                                                )}
                                            </p>
                                        ) : null
                                    )}
                                <span className={styles.cursor}>|</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.loading}>
                    <p>Đang phân tích mức độ cạnh tranh...</p>
                </div>
            )}

            {/* Suggestions Section - Chỉ hiển thị khi gõ tay hoàn tất */}
            {result && isTypingComplete && (
                <div className={styles.suggestions}>
                    <h2>Gợi ý cải thiện</h2>
                    <ul>
                        {getSuggestions(result).map((suggestion, index) => (
                            <li key={index}>
                                <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Call-to-Action Button - Chỉ hiển thị khi gõ tay hoàn tất */}
            {result && isTypingComplete && (
                <div className={styles.cta}>
                    <button>
                        Quay lại danh sách công việc
                        <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                    </button>
                </div>
            )}
        </section>
    );
};

export default ResultCompareCompetitiveness;
