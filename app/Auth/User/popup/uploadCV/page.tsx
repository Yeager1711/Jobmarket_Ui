'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import styles from './uploadCV.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import { showToastError, showToastSuccess } from '../../../../Ultils/toast';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

interface ResumeCvModalProps {
    name: string;
    isOpen: boolean;
    onClose: () => void;
}

function ModelUploadCV({ isOpen, onClose }: ResumeCvModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadDate, setUploadDate] = useState(new Date().toLocaleDateString('vi-VN'));
    const [userId, setUserId] = useState<number | null>(null);

    // Giải mã JWT để lấy userId
    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            try {
                const decoded: any = jwtDecode(access_token);
                setUserId(decoded.userId);
            } catch (error) {
                console.error('Lỗi giải mã access_token:', error);
            }
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            // Giới hạn 5MB
            setSelectedFile(file);
        } else {
            showToastError('File quá lớn! Vui lòng chọn file dưới 5MB.');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !userId) {
            showToastError('Vui lòng chọn file và đăng nhập lại!');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile); // Chỉ gửi file, không cần gửi fileName riêng

        try {
            const response = await axios.post(`${apiUrl}/users/${userId}/upload-cv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Đảm bảo UTF-8 encoding (thường không cần thiết vì trình duyệt tự xử lý)
                },
            });

            showToastSuccess('Tải lên thành công!');
            setSelectedFile(null);
            onClose();
        } catch (error: any) {
            console.error('Lỗi khi tải lên CV:', error);
            if (error.response && error.response.data) {
                showToastError(error.response.data.message || 'Lỗi khi tải lên CV.');
            } else {
                showToastError(error.message);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.modalOverlay} ${isOpen ? styles.show : styles.hide}`}>
            <div className={`${styles.modalContent} ${isOpen ? styles.slideDown : styles.slideUp}`}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h3>Hồ sơ đã tải lên</h3>

                <div className={styles.uploadBox}>
                    <label className={styles.uploadLabel}>
                        <FontAwesomeIcon icon={faCloudUploadAlt} /> Chọn hoặc kéo thả CV từ máy của bạn
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} hidden />
                    </label>
                    <p>Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5120KB</p>
                </div>

                {selectedFile && (
                    <div className={styles.fileInfo}>
                        <FontAwesomeIcon icon={faPaperclip} />
                        <span>{selectedFile.name}</span>
                        <p>Cập nhật lần cuối: {uploadDate}</p>
                        <button className={styles.btn_updateCV} onClick={handleUpload}>
                            Cập nhật CV
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ModelUploadCV;
