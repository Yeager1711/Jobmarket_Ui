'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './compareCompetitiveness.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSpinner,
    faCheck,
    faXmark,
    faChartLine,
    faUsers,
    faGraduationCap,
    faBriefcase,
    faLightbulb,
    faTrophy,
    faFlagCheckered,
    faList,
    faSun,
    faMoon,
    faArrowLeft,
    faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatPopup from 'app/Auth/User/popup/historyAI/page';
import { renderWithKeys } from '../../../ultis/renderWithKeys';
import { User } from 'app/interface/User';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
import { useApi } from '../../../../../Context/ApiContext/ApiContext';
import { showToastError } from 'app/Ultils/toast';

const ResultCompareCompetitiveness = () => {
    const router = useRouter();
    const { fetchUser, isReady, accessToken } = useApi();
    const [loading, setLoading] = useState(true);
    // Thêm state để theo dõi trạng thái iframe
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [isIframeBlocked, setIsIframeBlocked] = useState<boolean>(false);

    // Cập nhật handleKeywordClick
    const handleKeywordClick = (keyword: string) => {
        setSearchQuery(keyword);
        setIsIframeBlocked(false); // Reset trạng thái kiểm tra
    };

    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId') ? parseInt(searchParams.get('jobId') as string) : undefined;
    const resumeCVId = searchParams.get('resumeCVId') ? parseInt(searchParams.get('resumeCVId') as string) : undefined;

    const [status, setStatus] = useState<'loading' | 'typing' | 'suggestionsLoading' | 'completed'>('loading');
    const [typedText, setTypedText] = useState<string>(''); // For suitability
    const [introductionText, setIntroductionText] = useState<string>('');
    const [typedIntroduction, setTypedIntroduction] = useState<string>('');
    const [suggestionsReady, setSuggestionsReady] = useState<boolean>(false);
    const [fullTextContent, setFullTextContent] = useState<string>('');
    const [candidateName, setCandidateName] = useState<string>('Ứng viên');
    const [isPopupOpenHistoryAI, setIsPopupOpenHistoryAI] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Chuyển đổi trạng thái ngày đêm
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Tải thông tin người dùng từ API /users/me
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            const userData = await fetchUser();
            console.log('Dữ liệu user từ fetchUser:', userData); // Thêm logging để kiểm tra
            setUser(userData);
        } catch (error: any) {
            console.error('Lỗi khi lấy dữ liệu user:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            showToastError(error.response?.data?.message || 'Không thể tải thông tin người dùng do lỗi không xác định');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [fetchUser]);

    // Gọi fetchUserData khi component mount và khi isReady thay đổi
    useEffect(() => {
        if (isReady && accessToken) {
            fetchUserData();
        } else if (!accessToken) {
            setLoading(false);
            setUser(null);
        }
    }, [fetchUserData, isReady, accessToken]);

    // Đọc giá trị từ session
    useEffect(() => {
        const savedMode = sessionStorage.getItem('darkMode');
        if (savedMode) {
            setIsDarkMode(JSON.parse(savedMode));
        }
    }, []); // Chỉ chạy một lần khi component mount

    // Lưu isDarkMode vào sessionStorage mỗi khi nó thay đổi
    useEffect(() => {
        sessionStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // Hàm xử lý back page
    const handleBack = () => {
        if (jobId && resumeCVId) {
            router.push(`/Auth/User/checkout?jobId=${jobId}&resumeCVId=${resumeCVId}`);
        } else {
            router.push('/Auth/User/checkout');
        }
    };

    const [currentSection, setCurrentSection] = useState<
        | 'loading'
        | 'introduction'
        | 'suitability'
        | 'comparison'
        | 'education'
        | 'experience'
        | 'suggestions'
        | 'ranking'
        | 'conclusion'
    >('loading');

    const [typedComparison, setTypedComparison] = useState<string[]>([]);
    const [typedEducation, setTypedEducation] = useState<string>('');
    const [typedExperience, setTypedExperience] = useState<string>('');
    const [typedSuggestions, setTypedSuggestions] = useState<string[]>([]);
    const [typedRanking, setTypedRanking] = useState<string>('');
    const [typedConclusion, setTypedConclusion] = useState<string>('');

    const toggleDarkMode = () => {
        setIsDarkMode((prev: any) => !prev); // Chuyển đổi giữa sáng và tối
    };

    // Hàm loại bỏ dấu ** từ chuỗi
    const removeMarkdownBold = (text: string) => {
        return text.replace(/\*\*/g, '');
    };

    const getCandidateName = (introText: string) => {
        const match = introText.match(/mình sẽ giúp (.*?) so sánh mức độ cạnh tranh/);
        return match ? match[1].trim() : 'Ứng viên';
    };

    useEffect(() => {
        if (introductionText) {
            const name = getCandidateName(introductionText);
            setCandidateName(name);
        }
    }, [introductionText]);

    useEffect(() => {
        if (!jobId || !resumeCVId) {
            setTypedText('Error: jobId or resumeCVId not provided. Please check again!');
            setStatus('completed');
            setCurrentSection('conclusion');
            return;
        }

        const fetchData = async () => {
            setStatus('loading');
            setCurrentSection('loading');

            try {
                // Kiểm tra token trước khi gọi API
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    throw new Error('Access token not found. Please log in again.');
                }

                // Gọi API mới để phân tích mức độ cạnh tranh
                const response = await fetch(`${apiUrl}/users/analyze-competitiveness/${jobId}/${resumeCVId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                if (!result.data) {
                    throw new Error('Invalid response data');
                }

                // Tách phần introduction và content từ dữ liệu trả về
                const [intro, content] = result.data.split('---\n\n');
                setIntroductionText(intro.trim());
                setFullTextContent(content.trim());

                setStatus('typing');
                setCurrentSection('introduction');
            } catch (error: any) {
                setTypedText(`An error occurred: ${error.message}. Please try again later or contact support.`);
                setStatus('completed');
                setCurrentSection('conclusion');
            }
        };

        fetchData();
    }, [jobId, resumeCVId]);

    // Typing effect for introduction
    useEffect(() => {
        if (currentSection === 'introduction' && introductionText) {
            let cleanedText = introductionText.trim();
            if (cleanedText.startsWith('hào')) {
                cleanedText = 'Ch' + cleanedText.slice(1);
            }
            if (cleanedText.endsWith('....')) {
                cleanedText = cleanedText.replace(/\.{3,}$/, '');
                cleanedText += '.';
            } else if (!cleanedText.endsWith('.')) {
                cleanedText += '.';
            }

            let introIndex = 0;
            const introInterval = setInterval(() => {
                if (introIndex < cleanedText.length) {
                    setTypedIntroduction((prev) => prev + cleanedText.charAt(introIndex));
                    introIndex++;
                } else {
                    clearInterval(introInterval);
                    setCurrentSection('suitability');
                }
            }, 5);
            return () => clearInterval(introInterval);
        }
    }, [currentSection, introductionText]);

    // Typing effect for suitability
    useEffect(() => {
        if (currentSection === 'suitability' && fullTextContent) {
            const suitabilityText = getEvaluation(fullTextContent);
            let contentIndex = 0;
            setTypedText('');
            const contentInterval = setInterval(() => {
                if (contentIndex < suitabilityText.length) {
                    setTypedText((prev) => prev + suitabilityText.charAt(contentIndex));
                    contentIndex++;
                } else {
                    clearInterval(contentInterval);
                    setCurrentSection('comparison');
                }
            }, 5);
            return () => clearInterval(contentInterval);
        }
    }, [currentSection, fullTextContent]);

    // Typing effect for comparison
    useEffect(() => {
        if (currentSection === 'comparison') {
            const comparison = getComparison(fullTextContent);
            if (comparison) {
                let currentLineIndex = 0;
                let currentCharIndex = 0;
                const comparisonLines = comparison.split('\n').filter((line) => line.trim());
                const typedComparisonArray: string[] = new Array(comparisonLines.length).fill('');

                const comparisonInterval = setInterval(() => {
                    if (currentLineIndex < comparisonLines.length) {
                        const currentLine = comparisonLines[currentLineIndex];
                        if (currentCharIndex < currentLine.length) {
                            typedComparisonArray[currentLineIndex] = currentLine.slice(0, currentCharIndex + 1);
                            setTypedComparison([...typedComparisonArray]);
                            currentCharIndex++;
                        } else {
                            currentLineIndex++;
                            currentCharIndex = 0;
                        }
                    } else {
                        clearInterval(comparisonInterval);
                        setCurrentSection('education');
                    }
                }, 5);
                return () => clearInterval(comparisonInterval);
            } else {
                setCurrentSection('education');
            }
        }
    }, [currentSection, fullTextContent]);

    // Typing effect for education
    useEffect(() => {
        if (currentSection === 'education') {
            const education = getEducation(fullTextContent);
            if (education) {
                let currentCharIndex = 0;
                const educationInterval = setInterval(() => {
                    if (currentCharIndex < education.length) {
                        setTypedEducation(education.slice(0, currentCharIndex + 1));
                        currentCharIndex++;
                    } else {
                        clearInterval(educationInterval);
                        setCurrentSection('experience');
                    }
                }, 5);
                return () => clearInterval(educationInterval);
            } else {
                setCurrentSection('experience');
            }
        }
    }, [currentSection, fullTextContent]);

    // Typing effect for experience
    useEffect(() => {
        if (currentSection === 'experience') {
            const experience = getExperience(fullTextContent);
            if (experience) {
                let currentCharIndex = 0;
                const experienceInterval = setInterval(() => {
                    if (currentCharIndex < experience.length) {
                        setTypedExperience(experience.slice(0, currentCharIndex + 1));
                        currentCharIndex++;
                    } else {
                        clearInterval(experienceInterval);
                        setCurrentSection('suggestions');
                        setStatus('suggestionsLoading');
                    }
                }, 5);
                return () => clearInterval(experienceInterval);
            } else {
                setCurrentSection('suggestions');
                setStatus('suggestionsLoading');
            }
        }
    }, [currentSection, fullTextContent]);

    // Typing effect for suggestions
    useEffect(() => {
        if (currentSection === 'suggestions' && (status === 'suggestionsLoading' || status === 'completed')) {
            const suggestions = getSuggestions(fullTextContent);
            if (suggestions.length > 0) {
                let currentSuggestionIndex = 0;
                let currentCharIndex = 0;
                const typedSuggestionsArray: string[] = new Array(suggestions.length).fill('');

                const suggestionInterval = setInterval(() => {
                    if (currentSuggestionIndex < suggestions.length) {
                        const currentSuggestion = suggestions[currentSuggestionIndex];
                        if (currentCharIndex < currentSuggestion.length) {
                            typedSuggestionsArray[currentSuggestionIndex] = currentSuggestion.slice(
                                0,
                                currentCharIndex + 1
                            );
                            setTypedSuggestions([...typedSuggestionsArray]);
                            currentCharIndex++;
                        } else {
                            currentSuggestionIndex++;
                            currentCharIndex = 0;
                        }
                    } else {
                        clearInterval(suggestionInterval);
                        setSuggestionsReady(true);
                        setStatus('completed');
                        setCurrentSection('ranking');
                    }
                }, 5);
                return () => clearInterval(suggestionInterval);
            } else {
                setSuggestionsReady(true);
                setStatus('completed');
                setCurrentSection('ranking');
            }
        }
    }, [currentSection, status, fullTextContent]);

    // Typing effect for ranking
    useEffect(() => {
        if (currentSection === 'ranking') {
            const ranking = getRanking(fullTextContent);
            if (ranking) {
                let currentCharIndex = 0;
                const rankingInterval = setInterval(() => {
                    if (currentCharIndex < ranking.length) {
                        setTypedRanking(ranking.slice(0, currentCharIndex + 1));
                        currentCharIndex++;
                    } else {
                        clearInterval(rankingInterval);
                        setCurrentSection('conclusion');
                    }
                }, 5);
                return () => clearInterval(rankingInterval);
            } else {
                setCurrentSection('conclusion');
            }
        }
    }, [currentSection, fullTextContent]);

    // Typing effect for conclusion
    useEffect(() => {
        if (currentSection === 'conclusion' && status === 'completed') {
            const conclusion = getConclusion(fullTextContent);
            if (conclusion) {
                let currentCharIndex = 0;
                const conclusionInterval = setInterval(() => {
                    if (currentCharIndex < conclusion.length) {
                        setTypedConclusion(conclusion.slice(0, currentCharIndex + 1));
                        currentCharIndex++;
                    } else {
                        clearInterval(conclusionInterval);
                    }
                }, 5);
                return () => clearInterval(conclusionInterval);
            }
        }
    }, [currentSection, status, fullTextContent]);

    // Hàm phân tích dữ liệu
    const getEvaluation = (text: string) =>
        text.split('## 1. Đánh giá mức độ phù hợp')[1]?.split('## 2. So sánh mức độ cạnh tranh')[0]?.trim() || '';
    const getComparison = (text: string) =>
        text.split('## 2. So sánh mức độ cạnh tranh')[1]?.split('## 3. Học vấn')[0]?.trim() || '';
    const getEducation = (text: string) =>
        text.split('## 3. Học vấn')[1]?.split('## 4. Phân tích kinh nghiệm')[0]?.trim() || '';
    const getExperience = (text: string) =>
        text.split('## 4. Phân tích kinh nghiệm')[1]?.split('## 5. Gợi ý cải thiện')[0]?.trim() || '';
    const getSuggestions = (text: string) =>
        text
            .split('## 5. Gợi ý cải thiện')[1]
            ?.split('## 6. Xếp hạng chung')[0]
            ?.trim()
            .split('\n')
            .map((item) => item.trim())
            .filter((item) => item) || [];
    const getRanking = (text: string) =>
        text.split('## 6. Xếp hạng chung')[1]?.split('## 7. Kết luận')[0]?.trim() || '';
    const getConclusion = (text: string) => text.split('## 7. Kết luận')[1]?.trim() || '';

    // Hàm trích xuất dữ liệu cho phần "Đánh giá mức độ phù hợp"
    const getSuitabilityPercentage = (text: string) => {
        const match = text.match(/- \*\*Mức độ phù hợp với công việc\*\*: (\d+)%/);
        return match ? parseInt(match[1]) : 0;
    };

    const getSuitabilityExplanation = (text: string) =>
        text.match(/- \*\*Giải thích chi tiết:\*\* ([\s\S]+?)(?=- \*\*So sánh|\n## 2\.)/)?.[1]?.trim() || '';

    const getComparisonWithOthers = (text: string) =>
        text.match(/- \*\*So sánh với ứng viên khác\*\*: (Xếp hạng \d\/\d)/)?.[1]?.trim() || 'Chưa có dữ liệu';

    const getMarketSalary = (text: string) =>
        text.match(/- \*\*Mức lương thị trường\*\*: (.*?\/năm)/)?.[1]?.trim() || 'Chưa có dữ liệu';

    const suitabilityPercentage = getSuitabilityPercentage(typedText);
    const suitabilityExplanation = removeMarkdownBold(getSuitabilityExplanation(typedText));
    const comparisonWithOthers = removeMarkdownBold(getComparisonWithOthers(typedText));
    const marketSalary = removeMarkdownBold(getMarketSalary(typedText));

    // Hàm render cho Comparison
    const renderComparisonLine = (content: React.ReactNode, originalLine: string) => {
        const mainContent = removeMarkdownBold(originalLine.split(': ')[1]?.trim() || originalLine.trim());
        const hasYes = mainContent.toLowerCase().startsWith('có') || mainContent.toLowerCase().includes('khá tốt');
        const hasNo = mainContent.toLowerCase().startsWith('thiếu') || mainContent.toLowerCase().startsWith('không');

        return (
            <p>
                {hasYes ? (
                    <FontAwesomeIcon icon={faCheck} className={styles.check} />
                ) : hasNo ? (
                    <FontAwesomeIcon icon={faXmark} className={styles.xmark} />
                ) : null}
                {content}
            </p>
        );
    };

    // Hàm render cho Education
    const renderEducationLine = (content: React.ReactNode, originalLine: string) => {
        const mainContent = removeMarkdownBold(originalLine.split(': ')[1]?.trim() || originalLine.trim());
        const hasYes = mainContent.toLowerCase().startsWith('đáp ứng') || mainContent.toLowerCase().includes('khá tốt');
        const hasNo = mainContent.toLowerCase().startsWith('thiếu') || mainContent.toLowerCase().includes('chưa');

        return (
            <p>
                {hasYes ? (
                    <FontAwesomeIcon icon={faCheck} className={styles.check} />
                ) : hasNo ? (
                    <FontAwesomeIcon icon={faXmark} className={styles.xmark} />
                ) : null}
                {content}
            </p>
        );
    };

    // Hàm render cho Experience
    const renderExperienceLine = (content: React.ReactNode, originalLine: string) => {
        const mainContent = removeMarkdownBold(originalLine.split(': ')[1]?.trim() || originalLine.trim());
        const hasYes =
            mainContent.toLowerCase().startsWith('đáp ứng') || mainContent.toLowerCase().includes('ấn tượng');
        const hasNo = mainContent.toLowerCase().startsWith('thiếu') || mainContent.toLowerCase().includes('ngắn');

        return (
            <p>
                {hasYes ? (
                    <FontAwesomeIcon icon={faCheck} className={styles.check} />
                ) : hasNo ? (
                    <FontAwesomeIcon icon={faXmark} className={styles.xmark} />
                ) : null}
                {content}
            </p>
        );
    };

    return (
        <div className={`${styles.ResultCompareCompetitiveness} ${isDarkMode ? styles['dark-theme'] : ''}`}>
            <div className={styles.resultContainer}>
                <div className={styles.btn_backPage} onClick={handleBack}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <div className={styles.flex_controll__user}>
                    <div className={styles.ResultCompareCompetitiveness_header}>
                        <h3>Phân tích báo cáo mức độ cạnh tranh</h3>
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="15"
                                viewBox="0 0 32 24"
                                fill="none"
                            >
                                <path
                                    d="M7.00212 3.07087C6.45598 3.25137 6.45598 4.0243 7.00212 4.20326C8.26102 4.61672 9.24839 5.60564 9.66339 6.86453C9.84389 7.41067 10.6168 7.41067 10.7958 6.86453C11.2092 5.60564 12.1981 4.61826 13.457 4.20326C14.0032 4.02276 14.0032 3.24983 13.457 3.07087C12.1981 2.65741 11.2108 1.6685 10.7958 0.409604C10.6153 -0.136535 9.84235 -0.136535 9.66339 0.409604C9.24839 1.67004 8.26102 2.65741 7.00212 3.07087ZM24.3366 2.14521C24.1237 1.49725 23.2058 1.49725 22.9929 2.14521L21.9963 5.17829C21.5057 6.67168 20.3332 7.84264 18.8413 8.33324L15.8082 9.32987C15.1603 9.54277 15.1603 10.4607 15.8082 10.6736L18.8413 11.6702C20.3347 12.1608 21.5057 13.3333 21.9963 14.8252L22.9929 17.8583C23.2058 18.5062 24.1237 18.5062 24.3366 17.8583L25.3348 14.8252C25.8254 13.3318 26.9964 12.1608 28.4898 11.6702L31.5228 10.6736C32.1708 10.4607 32.1708 9.54277 31.5228 9.32987L28.4898 8.3317C26.9964 7.8411 25.8254 6.67014 25.3348 5.17675L24.3366 2.14521ZM13.7301 14.873C13.5172 14.225 12.5993 14.225 12.3864 14.873L12.2645 15.2448C11.7739 16.7382 10.6029 17.9092 9.10954 18.3998L8.73773 18.5216C8.08977 18.7345 8.08977 19.6525 8.73773 19.8654L9.10954 19.9873C10.6029 20.4779 11.7739 21.6488 12.2645 23.1422L12.3864 23.514C12.5993 24.162 13.5172 24.162 13.7301 23.514L13.852 23.1422C14.3426 21.6488 15.5151 20.4779 17.007 19.9873L17.3788 19.8654C18.0267 19.6525 18.0267 18.7345 17.3788 18.5216L17.007 18.3998C15.5136 17.9092 14.3426 16.7367 13.852 15.2448L13.7301 14.873Z"
                                    fill="url(#paint0_linear_35033_166622)"
                                ></path>
                                <path
                                    d="M0.409604 11.9911C-0.136535 12.1716 -0.136535 12.9446 0.409604 13.1235C1.6685 13.537 2.65587 14.5259 3.07087 15.7848C3.25138 16.3309 4.0243 16.3309 4.20326 15.7848C4.61672 14.5259 5.60563 13.5385 6.86453 13.1235C7.41067 12.943 7.41067 12.1701 6.86453 11.9911C5.60563 11.5777 4.61826 10.5888 4.20326 9.32987C4.02276 8.78373 3.24983 8.78373 3.07087 9.32987C2.65587 10.5903 1.6685 11.5777 0.409604 11.9911Z"
                                    fill="url(#paint1_linear_35033_166622)"
                                ></path>
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_35033_166622"
                                        x1="32.0088"
                                        y1="12"
                                        x2="0"
                                        y2="12"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="#B900F6"></stop>
                                        <stop offset="0.67" stopColor="#FF3C68" stopOpacity="0.3"></stop>
                                        <stop offset="1" stopColor="#FF6200" stopOpacity="0"></stop>
                                    </linearGradient>
                                    <linearGradient
                                        id="paint1_linear_35033_166622"
                                        x1="32.0088"
                                        y1="12"
                                        x2="0"
                                        y2="12"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="#B900F6"></stop>
                                        <stop offset="0.67" stopColor="#FF3C68" stopOpacity="0.3"></stop>
                                        <stop offset="1" stopColor="#FF6200" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                            JobMarket AI
                        </span>
                    </div>
                    <ChatPopup isOpen={isPopupOpenHistoryAI} onClose={() => setIsPopupOpenHistoryAI(false)} />
                    <div className={styles.control_user}>
                        <div className={styles.control}>
                            <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} onClick={toggleDarkMode} />
                            <FontAwesomeIcon icon={faList} onClick={() => setIsPopupOpenHistoryAI(true)} />
                        </div>
                        <div className={styles.user} onClick={() => router.push(`/Auth/User/tong_quan_tai_khoan`)}>
                            <span className={styles.name}>
                                {user?.firstName} {user?.lastName}
                            </span>
                            <img
                                src={user?.image ? `${apiUrl}${user?.image}` : '/images/user/user_default.png'}
                                alt={`${user?.firstName} ${user?.lastName}`}
                            />
                        </div>
                    </div>
                </div>

                {currentSection === 'loading' && (
                    <div className={styles.AI_reply_text}>
                        <div className={styles.logo_AI}>AI</div>
                        <div className={styles.analyzing}>
                            <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
                            <p>Đang phân tích mức độ cạnh tranh...</p>
                        </div>
                    </div>
                )}

                <div
                    className={`${styles.wrapper_flex} ${
                        ['loading', 'introduction'].includes(currentSection) ? styles.full_width : styles.partial_width
                    }`}
                >
                    <div className={styles.flex_left}>
                        {currentSection !== 'loading' &&
                            (searchQuery ? (
                                <div className={styles.search_preview}>
                                    <h4>
                                        <button onClick={() => setSearchQuery(null)} style={{marginRight: '1rem', background: 'none'}}>
                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </button>
                                        AI Google Search: {searchQuery}
                                    </h4>
                                    {/* Giao diện tìm kiếm thu nhỏ */}
                                    <iframe
                                        src={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&igu=1`}
                                        title={`Tìm kiếm ${searchQuery}`}
                                        className={styles.search_iframe}
                                    />
                                </div>
                            ) : (
                                <div className={styles.AI_reply_text}>
                                    <div className={styles.logo_AI}>AI</div>
                                    <div className={styles.typingText}>
                                        {typedIntroduction.split('\n').map((line, index) =>
                                            line.trim() ? (
                                                <p key={index}>
                                                    {renderWithKeys({
                                                        text: removeMarkdownBold(line),
                                                        onKeywordClick: handleKeywordClick,
                                                        className: styles.keyword,
                                                    })}
                                                </p>
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className={styles.flex_right}>
                        {currentSection !== 'loading' &&
                            [
                                'suitability',
                                'comparison',
                                'education',
                                'experience',
                                'suggestions',
                                'ranking',
                                'conclusion',
                            ].includes(currentSection) && (
                                <div className={styles.appropriate_slevel}>
                                    <h4 className={styles.sectionTitle}>
                                        <FontAwesomeIcon icon={faChartLine} className={styles.sectionIcon} />
                                        Đánh giá mức độ phù hợp theo thang điểm 100%
                                    </h4>
                                    <div className={styles.appropriate_slevel__container}>
                                        <div className={styles.appropriate_slevel__box}>
                                            Mức độ phù hợp với công việc
                                            <svg
                                                className={styles.circularProgress}
                                                width="100"
                                                height="100"
                                                viewBox="0 0 100 100"
                                            >
                                                <circle
                                                    className={styles.progressBackground}
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    strokeWidth="10"
                                                />
                                                <circle
                                                    className={styles.progressFill}
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    strokeWidth="10"
                                                    style={{
                                                        strokeDasharray: 283,
                                                        strokeDashoffset: 283 - (283 * suitabilityPercentage) / 100,
                                                    }}
                                                />
                                                <text
                                                    x="50"
                                                    y="50"
                                                    textAnchor="middle"
                                                    dy=".3em"
                                                    className={styles.progressValue}
                                                >
                                                    {suitabilityPercentage}%
                                                </text>
                                            </svg>
                                            <span className={styles.span_1}>
                                                <p>
                                                    {renderWithKeys({
                                                        text: suitabilityExplanation,
                                                        onKeywordClick: handleKeywordClick,
                                                        className: styles.keyword,
                                                    })}
                                                </p>
                                            </span>
                                        </div>
                                        <div className={styles.appropriate_slevel__box}>
                                            Hạng ứng viên đã ứng tuyển
                                            <span className={styles.span_2}>
                                                <p>
                                                    {renderWithKeys({
                                                        text: comparisonWithOthers,
                                                        onKeywordClick: handleKeywordClick,
                                                        className: styles.keyword,
                                                    })}
                                                </p>
                                            </span>
                                        </div>
                                        <div className={styles.appropriate_slevel__box}>
                                            Mức lương thị trường đang trả
                                            <span className={styles.span_3}>
                                                <p>
                                                    {renderWithKeys({
                                                        text: marketSalary,
                                                        onKeywordClick: handleKeywordClick,
                                                        className: styles.keyword,
                                                    })}
                                                </p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {currentSection !== 'loading' &&
                            ['comparison', 'education', 'experience', 'suggestions', 'ranking', 'conclusion'].includes(
                                currentSection
                            ) && (
                                <div className={styles.Compare_the_level_of_competition}>
                                    <h4 className={styles.sectionTitle}>
                                        <FontAwesomeIcon icon={faUsers} className={styles.sectionIcon} />
                                        So sánh mức độ cạnh tranh
                                    </h4>

                                    {[
                                        'comparison',
                                        'education',
                                        'experience',
                                        'suggestions',
                                        'ranking',
                                        'conclusion',
                                    ].includes(currentSection) && (
                                        <div className={styles.comparison_box}>
                                            <div className={styles.specific_information}>
                                                <div className={styles.AI_reply_text}>
                                                    <div className={styles.typingText}>
                                                        {typedComparison.length > 0 ? (
                                                            typedComparison.map((line, index) => (
                                                                <div key={index} className={styles.comparison_item}>
                                                                    {renderComparisonLine(
                                                                        renderWithKeys({
                                                                            text: line,
                                                                            onKeywordClick: handleKeywordClick,
                                                                            className: styles.keyword,
                                                                        }),
                                                                        line
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p>Đang tải dữ liệu...</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {['education', 'experience', 'suggestions', 'ranking', 'conclusion'].includes(
                                        currentSection
                                    ) && (
                                        <div className={styles.education}>
                                            <div className={styles.specific_information}>
                                                <div className={styles.AI_reply_text}>
                                                    <div className={styles.typingText}>
                                                        <h4 className={styles.sectionTitle}>
                                                            <FontAwesomeIcon
                                                                icon={faGraduationCap}
                                                                className={styles.sectionIcon}
                                                            />
                                                            Học vấn
                                                        </h4>
                                                        {typedEducation ? (
                                                            typedEducation.split('\n').map((line, index) =>
                                                                line.trim() ? (
                                                                    <div key={index}>
                                                                        {renderEducationLine(
                                                                            renderWithKeys({
                                                                                text: line,
                                                                                onKeywordClick: handleKeywordClick,
                                                                                className: styles.keyword,
                                                                            }),
                                                                            line
                                                                        )}
                                                                    </div>
                                                                ) : null
                                                            )
                                                        ) : (
                                                            <p>Đang tải dữ liệu...</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {['experience', 'suggestions', 'ranking', 'conclusion'].includes(
                                        currentSection
                                    ) && (
                                        <div className={styles.experience}>
                                            <div className={styles.AI_reply_text}>
                                                <div className={styles.typingText}>
                                                    <h4 className={styles.sectionTitle}>
                                                        <FontAwesomeIcon
                                                            icon={faBriefcase}
                                                            className={styles.sectionIcon}
                                                        />
                                                        Phân tích kinh nghiệm
                                                    </h4>
                                                    {typedExperience ? (
                                                        typedExperience.split('\n').map((line, index) =>
                                                            line.trim() ? (
                                                                <div key={index}>
                                                                    {renderExperienceLine(
                                                                        renderWithKeys({
                                                                            text: line,
                                                                            onKeywordClick: handleKeywordClick,
                                                                            className: styles.keyword,
                                                                        }),
                                                                        line
                                                                    )}
                                                                </div>
                                                            ) : null
                                                        )
                                                    ) : (
                                                        <p>Đang tải dữ liệu...</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {['suggestions', 'ranking', 'conclusion'].includes(currentSection) && (
                                        <div className={styles.suggests_good_argument}>
                                            <h4 className={styles.sectionTitle}>
                                                <FontAwesomeIcon icon={faLightbulb} className={styles.sectionIcon} />
                                                Gợi ý cải thiện
                                            </h4>
                                            <div className={styles.AI_reply_text}>
                                                <div className={styles.logo_AI}>AI</div>
                                                <div className={styles.suggests_good_argument__text}>
                                                    {status === 'suggestionsLoading' && !suggestionsReady ? (
                                                        <div className={styles.analyzing}>
                                                            <FontAwesomeIcon
                                                                icon={faSpinner}
                                                                spin
                                                                className={styles.spinner}
                                                            />
                                                            <p>Đang chuẩn bị gợi ý cải thiện...</p>
                                                        </div>
                                                    ) : (
                                                        typedSuggestions.map((suggestion, index) => (
                                                            <p key={index} className={styles.suggestion_item}>
                                                                {renderWithKeys({
                                                                    text: removeMarkdownBold(suggestion),
                                                                    onKeywordClick: handleKeywordClick,
                                                                    className: styles.keyword,
                                                                })}
                                                            </p>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {['ranking', 'conclusion'].includes(currentSection) && (
                                        <div className={styles.ranking}>
                                            <h4 className={styles.sectionTitle}>
                                                <FontAwesomeIcon icon={faTrophy} className={styles.sectionIcon} />
                                                Xếp hạng chung
                                            </h4>
                                            <div className={styles.AI_reply_text}>
                                                <div className={styles.logo_AI}>AI</div>
                                                <div className={styles.typingText}>
                                                    {typedRanking.split('\n').map((rank, index) =>
                                                        rank.trim() ? (
                                                            <p key={index}>
                                                                {renderWithKeys({
                                                                    text: removeMarkdownBold(rank),
                                                                    onKeywordClick: handleKeywordClick,
                                                                    className: styles.keyword,
                                                                })}
                                                            </p>
                                                        ) : null
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentSection === 'conclusion' && status === 'completed' && (
                                        <div className={styles.conclude}>
                                            <h4 className={styles.sectionTitle}>
                                                <FontAwesomeIcon
                                                    icon={faFlagCheckered}
                                                    className={styles.sectionIcon}
                                                />
                                                Kết luận
                                            </h4>
                                            <div className={styles.AI_reply_text}>
                                                <div className={styles.logo_AI}>AI</div>
                                                <div className={styles.typingText}>
                                                    {typedConclusion.split('\n').map((line, index) =>
                                                        line.trim() ? (
                                                            <p className={styles.conclude_text} key={index}>
                                                                {renderWithKeys({
                                                                    text: removeMarkdownBold(line),
                                                                    onKeywordClick: handleKeywordClick,
                                                                    className: styles.keyword,
                                                                })}
                                                            </p>
                                                        ) : null
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultCompareCompetitiveness;
