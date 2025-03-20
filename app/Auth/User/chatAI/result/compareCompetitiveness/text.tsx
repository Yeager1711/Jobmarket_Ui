'use client';
import { useState, useEffect } from 'react';
import styles from './compareCompetitiveness.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

const ResultCompareCompetitiveness = () => {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId') ? parseInt(searchParams.get('jobId') as string) : undefined;
    const resumeCVId = searchParams.get('resumeCVId') ? parseInt(searchParams.get('resumeCVId') as string) : undefined;

    const [status, setStatus] = useState<'loading' | 'typing' | 'suggestionsLoading' | 'completed'>('loading');
    const [typedText, setTypedText] = useState<string>('');
    const [introductionText, setIntroductionText] = useState<string>('');
    const [typedIntroduction, setTypedIntroduction] = useState<string>('');
    const [suggestionsReady, setSuggestionsReady] = useState<boolean>(false);
    const [fullTextContent, setFullTextContent] = useState<string>(''); // Lưu trữ toàn bộ nội dung sau khi fetch

    useEffect(() => {
        if (!jobId || !resumeCVId) {
            setTypedText('Error: jobId or resumeCVId not provided. Please check again!');
            setStatus('completed');
            return;
        }

        const fetchData = async () => {
            setStatus('loading');
            try {
                const storedResponse = await fetch(
                    `${apiUrl}/users/Getcompare-competitiveness/${jobId}/${resumeCVId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
                        },
                    }
                );

                let fullText: string;
                if (storedResponse.ok) {
                    const storedResult = await storedResponse.json();
                    if (storedResult.data?.analyze_text) {
                        const [intro, content] = storedResult.data.analyze_text.split('---\n\n');
                        setIntroductionText(intro.trim());
                        fullText = content.trim();
                        setFullTextContent(content.trim()); // Lưu toàn bộ nội dung
                    } else {
                        throw new Error('No stored analysis found');
                    }
                } else {
                    const response = await fetch(`${apiUrl}/users/compare-competitiveness/${jobId}/${resumeCVId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
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
                    const [intro, content] = result.data.split('---\n\n');
                    setIntroductionText(intro.trim());
                    fullText = content.trim();
                    setFullTextContent(content.trim()); // Lưu toàn bộ nội dung
                }

                setStatus('typing');

                let introIndex = 0;
                const introInterval = setInterval(() => {
                    if (introIndex < introductionText.length) {
                        const nextChar = introductionText.charAt(introIndex);
                        setTypedIntroduction((prev) => prev + nextChar);
                        introIndex++;
                    } else {
                        clearInterval(introInterval);
                        let contentIndex = 0;
                        const contentInterval = setInterval(() => {
                            if (contentIndex < fullText.length) {
                                setTypedText((prev) => prev + fullText.charAt(contentIndex));
                                contentIndex++;
                                if (
                                    fullText.indexOf('**4. Gợi ý cải thiện:**') !== -1 &&
                                    contentIndex >= fullText.indexOf('**4. Gợi ý cải thiện:**')
                                ) {
                                    setStatus('suggestionsLoading');
                                }
                            } else {
                                clearInterval(contentInterval);
                                setStatus('completed');
                                setSuggestionsReady(true);
                            }
                        }, 5);
                    }
                }, 5);

                return () => {
                    clearInterval(introInterval);
                };
            } catch (error: any) {
                setTypedText(`An error occurred: ${error.message}. Please try again later!`);
                setStatus('completed');
            }
        };

        fetchData();
    }, [jobId, resumeCVId, introductionText]);

    // Hàm phân tích dữ liệu
    const getIntroduction = (text: string) => text.split('**1. Đánh giá mức độ phù hợp')[0]?.trim() || '';
    const getEvaluation = (text: string) =>
        text.split('**1. Đánh giá mức độ phù hợp')[1]?.split('**2. So sánh mức độ cạnh tranh:**')[0]?.trim() || '';
    const getComparison = (text: string) =>
        text.split('**2. So sánh mức độ cạnh tranh:**')[1]?.split('**3. Phân tích kinh nghiệm:**')[0]?.trim() || '';
    const getExperienceAnalysis = (text: string) =>
        text.split('**3. Phân tích kinh nghiệm:**')[1]?.split('**4. Gợi ý cải thiện:**')[0]?.trim() || '';
    const getSuggestions = (text: string) =>
        text
            .split('**4. Gợi ý cải thiện:**')[1]
            ?.split('**5. Xếp hạng chung:**')[0]
            ?.trim()
            .split('\n*')
            .map((item) => item.trim())
            .filter((item) => item) || [];
    const getRanking = (text: string) =>
        text.split('**5. Xếp hạng chung:**')[1]?.split('**Kết luận:**')[0]?.trim() || '';
    const getConclusion = (text: string) => {
        const conclusionSection = text.split('**Kết luận:**')[1]?.trim() || '';
        return conclusionSection
            .split('\n')
            .filter(
                (line) =>
                    !line.includes('Mức độ phù hợp với công việc') &&
                    !line.includes('So sánh với ứng viên đã ứng tuyển khác') &&
                    !line.includes('Mức lương thị trường đang trả') &&
                    !line.includes('Điểm mạnh của') &&
                    !line.includes('Điểm yếu của') &&
                    !line.includes('Phân tích kinh nghiệm') &&
                    !line.includes('Gợi ý cải thiện') &&
                    !line.includes('Xếp hạng chung') &&
                    line.trim()
            )
            .join('\n');
    };

    const getSuitabilityPercentage = (text: string) => {
        const match = text.match(/Mức độ phù hợp với công việc:.*?(\d+-\d+|\d+)%/);
        if (match) {
            const range = match[1].split('-').map(Number);
            return range.length === 2 ? (range[0] + range[1]) / 2 : range[0];
        }
        return 0;
    };

    const getSuitabilityExplanation = (text: string) =>
        text.match(/- \*\*Giải thích:\*\*\s*([\s\S]+?)(?=- \*\*So sánh|\*\*2\. So sánh)/)?.[1]?.trim() || '';

    const getStrengths = (text: string) =>
        text
            .match(/- \*\*Điểm mạnh của Nguyễn Gia Huy:\*\*\s*([\s\S]+?)(?=- \*\*Điểm yếu)/)?.[1]
            ?.trim()
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.startsWith('*'))
            .map((line) => line.replace(/^\*\s*/, '')) || [];

    const getWeaknesses = (text: string) =>
        text
            .match(/- \*\*Điểm yếu của Nguyễn Gia Huy:\*\*\s*([\s\S]+?)(?=- \*\*Điểm mạnh của các ứng viên khác)/)?.[1]
            ?.trim()
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.startsWith('*'))
            .map((line) => line.replace(/^\*\s*/, '')) || [];

    const getOtherCandidates = (text: string) =>
        text
            .match(/- \*\*Điểm mạnh của các ứng viên khác:\*\*\s*([\s\S]+?)(?=\*\*3\. Phân tích kinh nghiệm)/)?.[1]
            ?.trim()
            .split('\n*')
            .map((line) => line.trim())
            .filter((line) => line) || [];

    const suitabilityPercentage = getSuitabilityPercentage(typedText);

    return (
        <div className={styles.ResultCompareCompetitiveness}>
            <div className={styles.resultContainer}>
                <div className={styles.ResultCompareCompetitiveness_header}>
                    <h3>Phân tích báo cáo mức độ cạnh tranh</h3>
                    <span>JobMarket AI</span>
                </div>

                {status === 'loading' && (
                    <div className={styles.AI_reply_text}>
                        <div className={styles.logo_AI}>AI</div>
                        <div className={styles.analyzing}>
                            <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
                            <p>Đang phân tích mức độ cạnh tranh...</p>
                        </div>
                    </div>
                )}

                <div className={styles.wrapper_flex}>
                    <div className={styles.flex_left}>
                        {status !== 'loading' && (
                            <div className={styles.AI_reply_text}>
                                <div className={styles.logo_AI}>AI</div>
                                <div className={styles.typingText}>
                                    {typedIntroduction
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
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.flex_right}>
                        {status !== 'loading' && (
                            <div className={styles.appropriate_slevel}>
                                <h4>Đánh giá mức độ phù hợp theo thang điểm 100</h4>
                                <div className={styles.AI_reply_text}>
                                    <div className={styles.logo_AI}>AI</div>
                                    <div className={styles.typingText}>
                                        <p>
                                            <strong>Mức độ phù hợp với công việc:</strong> {suitabilityPercentage}% -{' '}
                                            {getSuitabilityExplanation(typedText)}
                                        </p>
                                        {getEvaluation(typedText)
                                            .split('\n')
                                            .filter(
                                                (line) =>
                                                    line.includes('So sánh với ứng viên') ||
                                                    line.includes('Mức lương thị trường')
                                            )
                                            .map((line, index) =>
                                                line.trim() ? (
                                                    <p key={index}>
                                                        {line.includes('-') ? line : <strong>{line}</strong>}
                                                    </p>
                                                ) : null
                                            )}
                                    </div>
                                </div>
                                <div className={styles.appropriate_slevel__container}>
                                    <div className={styles.appropriate_slevel__box}>
                                        Mức độ phù hợp với công việc
                                        <span>
                                            {suitabilityPercentage}% <p>{getSuitabilityExplanation(typedText)}</p>
                                        </span>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${suitabilityPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className={styles.appropriate_slevel__box}>
                                        So sánh với ứng viên đã ứng tuyển khác
                                        <span>
                                            {typedText.match(/Xếp hạng (\d+\/\d+)/)?.[1] || 'N/A'}
                                            <p>
                                                {typedText.match(/So sánh với ứng viên đã ứng tuyển khác:.*?$/m)?.[0]}
                                            </p>
                                        </span>
                                    </div>
                                    <div className={styles.appropriate_slevel__box}>
                                        Mức lương thị trường đang trả
                                        <span>
                                            {typedText.match(/Mức lương thị trường đang trả:.*?(\$[0-9,]+.*?)/)?.[1] ||
                                                'N/A'}
                                            <p>{typedText.match(/Mức lương thị trường đang trả:.*?$/m)?.[0]}</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status !== 'loading' && (
                            <div className={styles.Compare_the_level_of_competition}>
                                <h4>So sánh mức độ cạnh tranh</h4>
                                <div className={styles.strengths_weaknesses}>
                                    <div className={styles.strengths_box}>
                                        <span>Điểm mạnh:</span>
                                        <div className={styles.strengths_box__text}>
                                            {getStrengths(fullTextContent).length > 0 ? (
                                                <ul>
                                                    {getStrengths(fullTextContent).map((strength, index) => (
                                                        <li key={index}>{strength}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>Đang tải dữ liệu...</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.weaknesses_box}>
                                        <span>Điểm yếu:</span>
                                        <div className={styles.strengths_box__text}>
                                            {getWeaknesses(fullTextContent).length > 0 ? (
                                                <ul>
                                                    {getWeaknesses(fullTextContent).map((weakness, index) => (
                                                        <li key={index}>{weakness}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>Đang tải dữ liệu...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.candidates_apply}>
                                    <span>Các ứng viên khác</span>
                                    <div className={styles.AI_reply_text}>
                                        <div className={styles.typingText}>
                                            {getOtherCandidates(fullTextContent).length > 0 ? (
                                                getOtherCandidates(fullTextContent).map((candidate, index) => (
                                                    <p key={index}>{`* ${candidate}`}</p>
                                                ))
                                            ) : (
                                                <p>Đang tải dữ liệu...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.experience_analysis}>
                                    <h4>Phân tích kinh nghiệm</h4>
                                    <div className={styles.AI_reply_text}>
                                        <div className={styles.logo_AI}>AI</div>
                                        <div className={styles.typingText}>
                                            {getExperienceAnalysis(fullTextContent) ? (
                                                getExperienceAnalysis(fullTextContent)
                                                    .split('\n')
                                                    .map((line, index) =>
                                                        line.trim() ? (
                                                            <p key={index}>
                                                                {line.includes('-') ? (
                                                                    line
                                                                ) : (
                                                                    <strong>{line}</strong>
                                                                )}
                                                            </p>
                                                        ) : null
                                                    )
                                            ) : (
                                                <p>Đang tải dữ liệu...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {(status === 'suggestionsLoading' || status === 'completed') && (
                                    <div className={styles.suggests_good_argument}>
                                        <h4>Gợi ý cải thiện</h4>
                                        <div className={styles.AI_reply_text}>
                                            <div className={styles.logo_AI}>AI</div>
                                            {status === 'suggestionsLoading' && !suggestionsReady ? (
                                                <div className={styles.analyzing}>
                                                    <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
                                                    <p>Đang chuẩn bị gợi ý cải thiện...</p>
                                                </div>
                                            ) : (
                                                getSuggestions(fullTextContent).map((suggestion, index) => {
                                                    const [title, ...description] = suggestion.split(':');
                                                    return (
                                                        <div key={index} className={styles.suggestion_item}>
                                                            <strong>{title}:</strong>
                                                            <p>{description.join(':').trim()}</p>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.ranking}>
                                    <span>Xếp hạng chung</span>
                                    <div className={styles.AI_reply_text}>
                                        <div className={styles.typingText}>
                                            {getRanking(fullTextContent)
                                                .split('\n')
                                                .map((rank, index) =>
                                                    rank.trim() ? <p key={index}>{rank.trim()}</p> : null
                                                )}
                                        </div>
                                    </div>
                                </div>

                                {status === 'completed' && (
                                    <div className={styles.conclude}>
                                        <h4>Kết luận</h4>
                                        <div className={styles.AI_reply_text}>
                                            <div className={styles.logo_AI}>AI</div>
                                            <div className={styles.typingText}>
                                                {getConclusion(fullTextContent)
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