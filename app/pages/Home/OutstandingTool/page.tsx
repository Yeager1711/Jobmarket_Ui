import React, { useEffect, useState, useRef } from 'react';
import styles from './OutstandingTool.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import OutstandingTool_Details from '../../DefaultLayouts/Popup/OutstandingTool_Details/pages';

function OutstandingTool() {
    const [isExpand, setIsExpand] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeBoxIndex, setActiveBoxIndex] = useState<number | null>(null);
    const [isCycling, setIsCycling] = useState(false);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (container) {
                const h1 = container.querySelector('h1');
                if (h1) {
                    const rect = h1.getBoundingClientRect();
                    const isCentered =
                        rect.top >= window.innerHeight / 4 && rect.bottom <= (window.innerHeight * 3) / 4;

                    setIsExpand(!isCentered);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleControlClick = () => {
        if (isCycling) return;
        setIsCycling(true);

        let currentIndex = 0;
        setActiveBoxIndex(currentIndex);

        const interval = setInterval(() => {
            currentIndex += 1;
            if (currentIndex >= 6) {
                clearInterval(interval);
                setIsCycling(false);
                setActiveBoxIndex(null);
            } else {
                setActiveBoxIndex(currentIndex);
            }
        }, 500);
    };

    const boxClass = (index: number) => {
        return activeBoxIndex === index ? `${styles.box} ${styles.active}` : styles.box;
    };

    return (
        <section className={`${styles.OutstandingTool} ${isExpand ? styles.expend : ''}`}>
            <div className={styles.OutstandingTool__container} ref={containerRef}>
                <div className={styles.headers}>
                    <h1>Công cụ hỗ trợ</h1>
                    <div className={styles.control_button}>
                        <button className={styles.btn__control} onClick={handleControlClick}>
                            Công cụ
                        </button>
                        <button className={styles.btn__details} onClick={() => setIsDetailsVisible(true)}>
                            Chi tiết
                        </button>
                    </div>
                </div>
                <div className={boxClass(0)}>
                    <div className={styles.content}>
                        <h2>Tính lương GROSS - NET</h2>
                        <Link href="OutstandingTool/Details/Salary_GrossNet" target="_blank" rel="noopener noreferrer">
                            Khám phá ngay <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>
                <div className={boxClass(1)}>
                    <div className={styles.content}>
                        <h2>Tính lãi suất kép</h2>
                        <Link
                            href="OutstandingTool/Details/Compound__Interest"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Khám phá ngay <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>
                <div className={boxClass(2)}>
                    <div className={styles.content}>
                        <h2>Tính thuế thu nhập cá nhân</h2>
                        <Link href="OutstandingTool/Details/Personal_Tax" target="_blank" rel="noopener noreferrer">
                            Khám phá ngay <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>
                <div className={boxClass(3)}>
                    <div className={styles.content}>
                        <h2>Tính Bảo Hiểm thất nghiệp</h2>
                        <Link
                            href="OutstandingTool/Details/Unemployment__Insurance"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Khám phá ngay <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>
                <div className={boxClass(4)}>
                    <div className={styles.content}>
                        <h2>Lập kế hoạch tiết kiệm</h2>
                        <Link href="OutstandingTool/Details/Savings__Plan" target="_blank" rel="noopener noreferrer">
                            Khám phá ngay <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>
                <div className={boxClass(5)}>
                    <div className={styles.content}>
                        <h2>Tính Bảo Hiểm xã hội 1 lần</h2>
                        <Link
                            href="OutstandingTool/Details/Social__Insurance"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Khám phá ngay <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>
            </div>
            {isDetailsVisible && <OutstandingTool_Details onClose={() => setIsDetailsVisible(false)} />}
        </section>
    );
}

export default OutstandingTool;
