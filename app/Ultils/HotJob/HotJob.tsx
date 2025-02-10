// HotJob.tsx
import React, { ReactNode } from 'react';
import styles from './HotJob.module.scss';

interface HotJobProps {
  isHot: boolean;
  children?: ReactNode; // Cho phép truyền nội dung bên trong cặp thẻ
}

const HotJob: React.FC<HotJobProps> = ({ isHot, children }) => {
  if (!isHot) return null;

  return (
    <span className={styles.hot_job}>
      <p>
        <svg
          className="hot-job__icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 012.5 2.5z" />
        </svg>
        {children}
      </p>
    </span>
  );
};


export default HotJob;
