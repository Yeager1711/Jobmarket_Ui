'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './historyAI.module.scss';
import { useApi } from '../../../../Context/ApiContext/ApiContext';

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
    const [isRightPanelHovered, setIsRightPanelHovered] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

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
        // Clear any existing timeout to prevent hiding
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setHoveredOrderCode(orderCode);
    };

    const handleMouseLeaveChatItem = () => {
        // Set a timeout to hide the analyzeText after a short delay
        const id = setTimeout(() => {
            if (!isRightPanelHovered) {
                setHoveredOrderCode(null);
            }
        }, 300); // 300ms delay to allow the user to move to the right panel
        setTimeoutId(id);
    };

    const handleMouseEnterRightPanel = () => {
        // Prevent hiding when the right panel is hovered
        setIsRightPanelHovered(true);
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
    };

    const handleMouseLeaveRightPanel = () => {
        // Hide the analyzeText when leaving the right panel
        setIsRightPanelHovered(false);
        setHoveredOrderCode(null);
    };

    // Find the currently hovered chat item
    const hoveredChat = chats.find((chat) => chat.orderCode === hoveredOrderCode);

    return (
        <div className={styles.overlay} onClick={onClose}>
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
                                            onMouseLeave={handleMouseLeaveChatItem}
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

                    <div
                        className={styles.chat_List__item}
                        onMouseEnter={handleMouseEnterRightPanel}
                        onMouseLeave={handleMouseLeaveRightPanel}
                    >
                        <div className={styles.chatList_item}>
                            {hoveredChat ? (
                                <div className={styles.chatAnalysis}>
                                    <h4>{hoveredChat.title} ({hoveredChat.time})</h4>
                                    <p className={styles.analyzeText}>{hoveredChat.analyze_text}</p>
                                </div>
                            ) : (
                                <p>Di chuột vào một mục để xem chi tiết.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;