'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './historyAI.module.scss';
import { useApi } from '../../../../Context/ApiContext/ApiContext';
import { renderWithKeys } from '../../ultis/renderWithKeys';

// Define the interface for a single chat item
interface ChatItem {
    title: string;
    time: string;
    category: string;
    orderCode: string;
    analyze_text: string;
}

// Define the interface for the grouped chats
interface GroupedChats {
    [key: string]: ChatItem[];
}

// Define the props interface for the ChatPopup component
interface ChatPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ isOpen, onClose }) => {
    const { fetchOrdersByUserId } = useApi();
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hoveredOrderCode, setHoveredOrderCode] = useState<string | null>(null);

    // Function to fetch and map orders to chat items
    const fetchChats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const orders = await fetchOrdersByUserId();

            // Filter orders to only include those with status 'Đã thanh toán'
            const paidOrders = orders.filter((order: any) => order.orderDetails.status === 'Đã thanh toán');

            // Map paid orders to ChatItem format
            const mappedChats: ChatItem[] = paidOrders.map((order: any) => {
                const purchaseDate = new Date(
                    order.orderDetails.created_at.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')
                );
                const now = new Date();
                const diffInSeconds = Math.floor((now.getTime() - purchaseDate.getTime()) / 1000);

                let time: string;
                let category: string;

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);

                const isToday =
                    purchaseDate.getDate() === today.getDate() &&
                    purchaseDate.getMonth() === today.getMonth() &&
                    purchaseDate.getFullYear() === today.getFullYear();

                const isYesterday =
                    purchaseDate.getDate() === yesterday.getDate() &&
                    purchaseDate.getMonth() === yesterday.getMonth() &&
                    purchaseDate.getFullYear() === yesterday.getFullYear();

                if (isToday) {
                    if (diffInSeconds < 60) {
                        time = `${diffInSeconds} seconds ago`;
                    } else if (diffInSeconds < 3600) {
                        time = `${Math.floor(diffInSeconds / 60)} minutes ago`;
                    } else {
                        time = `${Math.floor(diffInSeconds / 3600)} hours ago`;
                    }
                    category = 'Today';
                } else if (isYesterday) {
                    time = `${Math.floor(diffInSeconds / 86400)} days ago`;
                    category = 'Yesterday';
                } else {
                    time = `${Math.floor(diffInSeconds / 86400)} days ago`;
                    category = 'Older';
                }

                return {
                    title: `Vị trí: ${order.orderDetails.position}`,
                    time,
                    category,
                    orderCode: order.orderCode,
                    analyze_text: order.orderDetails.analyze_text,
                };
            });

            setChats(mappedChats);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Không thể tải lịch sử chat. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, [fetchOrdersByUserId]);

    // Fetch chats when the popup opens
    useEffect(() => {
        if (isOpen) {
            fetchChats();
        }
    }, [isOpen, fetchChats]);

    // Group chats by category with type safety
    const groupedChats: GroupedChats = chats.reduce((acc: GroupedChats, chat: ChatItem) => {
        if (!acc[chat.category]) {
            acc[chat.category] = [];
        }
        acc[chat.category].push(chat);
        return acc;
    }, {});

    const categories: string[] = Object.keys(groupedChats);

    if (!isOpen) return null;

    const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleMouseEnterChatItem = (orderCode: string) => {
        setHoveredOrderCode(orderCode);
    };

    // Find the currently hovered chat item
    const hoveredChat = chats.find((chat) => chat.orderCode === hoveredOrderCode);

    // Function to handle keyword clicks (optional)
    const handleKeywordClick = (keyword: string) => {
        console.log(`Keyword clicked: ${keyword}`);
        // Add your logic here, e.g., open a modal, filter content, etc.
    };

    // Function to parse and render analyzeText according to the new design
    const renderAnalyzeText = (text: string) => {
        // Split the text at the '---' separator and take the content after it
        const sections = text.split('---');
        const relevantText = sections.length > 1 ? sections[1].trim() : text.trim();

        // Split the text into sections based on '##' headings
        const sectionBlocks = relevantText.split(/(?=## \d+\.)/);
        const parsedSections: { [key: string]: string } = {};

        // Parse each section and store it by its heading
        sectionBlocks.forEach((block) => {
            const match = block.match(/## \d+\. (.*?)\n/);
            if (match) {
                const sectionTitle = match[1].trim();
                const sectionContent = block.replace(match[0], '').trim();
                parsedSections[sectionTitle] = sectionContent;
            } else if (!Object.keys(parsedSections).length) {
                // The first block before any '##' is the intro
                parsedSections['Intro'] = block.trim();
            }
        });

        // Extract data for each section
        const introText = parsedSections['Intro'] || '';

        // Parse "Đánh giá mức độ phù hợp của Huỳnh Nam"
        const appropriateLevel = parsedSections['Đánh giá mức độ phù hợp của Huỳnh Nam'] || '';
        const appropriateLevelItems = appropriateLevel.split('\n- ').filter((item) => item.trim());
        const suitabilityMatch = appropriateLevelItems.find((item) => item.includes('Mức độ phù hợp với công việc'));
        const comparisonMatch = appropriateLevelItems.find((item) => item.includes('So sánh với ứng viên khác'));
        const salaryMatch = appropriateLevelItems.find((item) => item.includes('Mức lương thị trường'));

        const suitability = suitabilityMatch
            ? suitabilityMatch
                  .replace('**Mức độ phù hợp với công việc**: ', '')
                  .replace(/\[.*?\]/, '')
                  .replace(/^-+\s*/, '')
                  .trim()
            : '';
        const comparison = comparisonMatch
            ? comparisonMatch
                  .replace('**So sánh với ứng viên khác**: ', '')
                  .replace(/\[.*?\]/, '')
                  .trim()
            : '';
        const salary = salaryMatch
            ? salaryMatch
                  .replace('**Mức lương thị trường**: ', '')
                  .replace(/\[.*?\]/, '')
                  .trim()
            : '';

        // Parse "So sánh mức độ cạnh tranh"
        const competitionLevel = parsedSections['So sánh mức độ cạnh tranh'] || '';
        const competitionItems = competitionLevel.split('\n- ').filter((item) => item.trim());
        const techStrengths =
            competitionItems
                .find((item) => item.includes('Điểm mạnh kỹ thuật'))
                ?.replace('**Điểm mạnh kỹ thuật**: ', '')
                .replace(/^-+\s*/, '')
                .trim() || '';
        const techWeaknesses =
            competitionItems
                .find((item) => item.includes('Điểm yếu kỹ thuật'))
                ?.replace('**Điểm yếu kỹ thuật**: ', '')
                .trim() || '';
        const expStrengths =
            competitionItems
                .find((item) => item.includes('Điểm mạnh kinh nghiệm'))
                ?.replace('**Điểm mạnh kinh nghiệm**: ', '')
                .trim() || '';
        const expWeaknesses =
            competitionItems
                .find((item) => item.includes('Điểm yếu kinh nghiệm'))
                ?.replace('**Điểm yếu kinh nghiệm**: ', '')
                .trim() || '';
        const softSkillsStrengths =
            competitionItems
                .find((item) => item.includes('Điểm mạnh kỹ năng mềm'))
                ?.replace('**Điểm mạnh kỹ năng mềm**: ', '')
                .trim() || '';
        const softSkillsWeaknesses =
            competitionItems
                .find((item) => item.includes('Điểm yếu kỹ năng mềm'))
                ?.replace('**Điểm yếu kỹ năng mềm**: ', '')
                .trim() || '';

        // Parse "Học vấn"
        const education = parsedSections['Học vấn'] || '';
        const educationItems = education.split('\n- ').filter((item) => item.trim());
        const academicBackground =
            educationItems
                .find((item) => item.includes('Nền tảng học vấn'))
                ?.replace('**Nền tảng học vấn**: ', '')
                .trim() || '';
        const certificates =
            educationItems
                .find((item) => item.includes('Chứng chỉ và khóa học'))
                ?.replace('**Chứng chỉ và khóa học**: ', '')
                .trim() || '';
        const potential =
            educationItems
                .find((item) => item.includes('Tiềm năng phát triển'))
                ?.replace('**Tiềm năng phát triển**: ', '')
                .trim() || '';

        // Parse "Phân tích kinh nghiệm"
        const experienceAnalysis = parsedSections['Phân tích kinh nghiệm'] || '';
        const experienceItems = experienceAnalysis.split('\n- ').filter((item) => item.trim());
        const practicalExperience =
            experienceItems
                .find((item) => item.includes('Kinh nghiệm thực tế'))
                ?.replace('**Kinh nghiệm thực tế**: ', '')
                .trim() || '';
        const requirementComparison =
            experienceItems
                .find((item) => item.includes('So sánh với yêu cầu'))
                ?.replace('**So sánh với yêu cầu**: ', '')
                .trim() || '';
        const candidateComparison =
            experienceItems
                .find((item) => item.includes('So sánh với ứng viên khác'))
                ?.replace('**So sánh với ứng viên khác**: ', '')
                .trim() || '';

        // Parse "Gợi ý cải thiện"
        const suggestions = parsedSections['Gợi ý cải thiện'] || '';
        const suggestionItems = suggestions
            .split('\n')
            .filter((item) => item.trim().match(/^\d+\.\s/))
            .map((item) => item.replace(/^\d+\.\s/, '').trim());

        // Parse "Kết luận"
        const conclusion = parsedSections['Kết luận'] || '';

        return (
            <div className={styles.AI_wrapper__reply}>
                {/* Intro Section */}
                <div className={styles.AI_reply_intro}>
                    <div className={styles.AI_rep__text}>
                        <p className={styles.text}>
                            {renderWithKeys({ text: introText, onKeywordClick: handleKeywordClick })}
                        </p>
                    </div>
                </div>

                {/* Appropriate Level Section */}
                <div className={styles.AI_reply_AppropriateLevel}>
                    <div className={styles.AI_rep__text}>
                        <div className={styles.box_item}>
                            <span className={styles.box_1}>
                                Mức độ phù hợp: <p>{suitability}</p>
                            </span>
                            <span className={styles.box_1}>
                                Xếp hạng: <p>{comparison}</p>
                            </span>
                            <span className={styles.box_1}>
                                Mức lương thị trường: <p>{salary}</p>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Compare the Level of Competition Section */}
                <div className={styles.AI_reply_CompareTheLevelOfCompetition}>
                    <div className={styles.AI_rep__text}>
                        <div className={styles.box_item}>
                            <h4>Điểm mạnh / Điểm yếu Kĩ Thuật</h4>
                            <span className={styles.strengths}>
                                {renderWithKeys({ text: `- ${techStrengths}`, onKeywordClick: handleKeywordClick })}
                            </span>
                            <span className={styles.weakness}>
                                {renderWithKeys({ text: `- ${techWeaknesses}`, onKeywordClick: handleKeywordClick })}
                            </span>
                        </div>
                        <div className={styles.box_item}>
                            <h4>Điểm mạnh / Điểm yếu kinh nghiệm</h4>
                            <span className={styles.strengths}>
                                {renderWithKeys({ text: `- ${expStrengths}`, onKeywordClick: handleKeywordClick })}
                            </span>
                            <span className={styles.weakness}>
                                {renderWithKeys({ text: `- ${expWeaknesses}`, onKeywordClick: handleKeywordClick })}
                            </span>
                        </div>
                        <div className={styles.box_item}>
                            <h4>Điểm mạnh / Điểm yếu Kỹ năng mềm</h4>
                            <span className={styles.strengths}>
                                {renderWithKeys({
                                    text: `- ${softSkillsStrengths}`,
                                    onKeywordClick: handleKeywordClick,
                                })}
                            </span>
                            <span className={styles.weakness}>
                                {renderWithKeys({
                                    text: `- ${softSkillsWeaknesses}`,
                                    onKeywordClick: handleKeywordClick,
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Education Section */}
                <div className={styles.AI_reply_education}>
                    <div className={styles.AI_rep__text}>
                        <div className={styles.box_item}>
                            <h4>Nền tảng học vấn / Chứng chỉ khóa học / Tiềm năng phát triển</h4>
                            <span className={styles.item}>
                                <strong className={styles.title}> - Nền tảng học vấn: </strong>
                                {renderWithKeys({ text: academicBackground, onKeywordClick: handleKeywordClick })}
                            </span>
                            <span className={styles.item}>
                                <strong className={styles.title}> - Chứng chỉ và khóa học: </strong>
                                {renderWithKeys({ text: certificates, onKeywordClick: handleKeywordClick })}
                            </span>
                            <span className={styles.item}>
                                <strong className={styles.title}> - Tiềm năng phát triển: </strong>
                                {renderWithKeys({ text: potential, onKeywordClick: handleKeywordClick })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Experience Analysis Section */}
                <div className={styles.AI_reply_Experience_analysis}>
                    <div className={styles.AI_rep__text}>
                        <div className={styles.box_item}>
                            <h4>Kinh nghiệm thực tế / So sánh với yêu cầu / So sánh với ứng viên khác</h4>
                            <span className={styles.item}>
                                <strong className={styles.title_r1}> - Kinh nghiệm thực tế: </strong>
                                {renderWithKeys({ text: practicalExperience, onKeywordClick: handleKeywordClick })}
                            </span>
                            <span className={styles.item}>
                                <strong className={styles.title_r1}> - So sánh với yêu cầu: </strong>
                                {renderWithKeys({ text: requirementComparison, onKeywordClick: handleKeywordClick })}
                            </span>
                            <span className={styles.item}>
                                <strong className={styles.title_r1}> - So sánh với ứng viên khác: </strong>
                                {renderWithKeys({ text: candidateComparison, onKeywordClick: handleKeywordClick })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Suggestions Section */}
                <div className={styles.AI_reply_Suggestions_good}>
                    <div className={styles.AI_rep__text}>
                        <div className={styles.box_item}>
                            <h4>Gợi ý cải thiện</h4>
                            {suggestionItems.map((item, index) => {
                                const [title, ...rest] = item.split(':');
                                const description = rest.join(':').trim();
                                return (
                                    <span key={index} className={styles.item}>
                                        <strong className={styles.title_r2}>{`${index + 1}. ${title}: `}</strong>
                                        {renderWithKeys({ text: description, onKeywordClick: handleKeywordClick })}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Conclusion Section */}
                <div className={styles.AI_reply_Experience_analysis}>
                    <div className={styles.AI_rep__text}>
                        <div className={styles.box_item}>
                            <h4>Kết luận</h4>
                            <span className={styles.item}>
                                <strong className={styles.title_r3}>
                                    {renderWithKeys({ text: conclusion, onKeywordClick: handleKeywordClick })}
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup} onClick={handlePopupClick}>
                <div className={styles.header}>
                    <input type="text" placeholder="Search..." className={styles.searchInput} />
                    <div className={styles.actions}></div>
                </div>

                <div className={styles.chat_wrapper}>
                    <div className={styles.chatList}>
                        {loading ? (
                            <p className={styles.loading}>Đang tải...</p>
                        ) : error ? (
                            <p className={styles.error}>{error}</p>
                        ) : categories.length > 0 ? (
                            categories.map((category: string) => (
                                <div key={category} className={styles.histroyList}>
                                    <h3 className={styles.category}>{category}</h3>
                                    {groupedChats[category].map((chat: ChatItem, index: number) => (
                                        <div
                                            key={`${chat.orderCode}-${index}`}
                                            className={styles.chatItem}
                                            onMouseEnter={() => handleMouseEnterChatItem(chat.orderCode)}
                                        >
                                            <p className={styles.chatTitle}>{chat.title}</p>
                                            <span className={styles.chatTime}>{chat.time}</span>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p className={styles.noChats}>Không có lịch sử chat nào</p>
                        )}
                    </div>

                    <div className={styles.chat_List__item}>
                        <div className={styles.chatList_item}>
                            {hoveredChat ? (
                                renderAnalyzeText(hoveredChat.analyze_text)
                            ) : (
                                <p className={styles.empty_Chats}>Hover chuột vào phân tích để xem nhanh</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;
