import { useState } from 'react';
import styles from './historyAI.module.scss';

// Define the interface for a single chat item
interface ChatItem {
  title: string;
  time: string;
  category: string;
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
  // Early return if the popup is not open
  if (!isOpen) return null;

  // Define the chat data with type annotation
  const chatData: ChatItem[] = [
    { title: 'Vị trí: [Fresher] FRONTEND ENGINEER (ID: 2034394)', time: '20 seconds ago', category: 'Today' },
    { title: 'Front-End/Website Developer', time: '2 hours ago', category: 'Today' },
    { title: 'Middle Front-end Developer (ReactJS/VueJS)', time: '7 hours ago', category: 'Today' },
    { title: '[Junior/Middle] FRONTEND ENGINEER', time: '5 hours ago', category: 'Today' },
    { title: 'Backend Developer (Python, Django)', time: '1 day ago', category: 'yesterday' },
    { title: 'SYSTEM BACKEND - GOLANG', time: '1 day ago', category: 'yesterday' },
    { title: '[IT Product - Senior Backend Developer (Ruby on Rails)', time: '1 day ago', category: 'yesterday' },
    { title: 'Game Backend (Golang)', time: '1 day ago', category: 'yesterday' },
  ];

  // Group chats by category with type safety
  const groupedChats: GroupedChats = chatData.reduce((acc: GroupedChats, chat: ChatItem) => {
    if (!acc[chat.category]) {
      acc[chat.category] = [];
    }
    acc[chat.category].push(chat);
    return acc;
  }, {});

  // Handle the case where groupedChats might be empty
  const categories: string[] = Object.keys(groupedChats);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <input type="text" placeholder="Search..." className={styles.searchInput} />
          <div className={styles.actions}></div>
        </div>
        <div className={styles.chatList}>
          {categories.length > 0 ? (
            categories.map((category: string) => (
              <div key={category}>
                <h3 className={styles.category}>{category}</h3>
                {groupedChats[category].map((chat: ChatItem, index: number) => (
                  <div key={index} className={styles.chatItem}>
                    <p className={styles.chatTitle}>{chat.title}</p>
                    <span className={styles.chatTime}>{chat.time}</span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className={styles.noChats}>No chats available</p>
          )}
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;