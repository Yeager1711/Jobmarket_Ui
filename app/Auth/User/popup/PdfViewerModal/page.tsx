import React from "react";
import styles from "./PdfViewerModal.module.scss"; // File SCSS riêng

interface PdfViewerModalProps {
    pdfUrl: string;
    onClose: () => void;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ pdfUrl, onClose }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    &times;
                </button>
                <iframe src={pdfUrl} className={styles.pdfViewer} />
            </div>
        </div>
    );
};

export default PdfViewerModal;
