'use client';
import { useState } from 'react';
import styles from './AI.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faFile } from '@fortawesome/free-solid-svg-icons';
import { showToastError, showToastSuccess } from '../../../Ultils/toast';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

interface ChatMessage {
    type: 'user' | 'response';
    content: string | File;
}

function CvParserService() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            showToastError('Vui lòng chọn file PDF');
            setSelectedFile(null);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedFile) {
            showToastError('Vui lòng chọn file PDF trước');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', selectedFile);
    
        try {
            const response = await fetch(`${apiUrl}/chatGPT/upload-cv`, {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
            if (response.ok) {
                setAiResponse(data.aiResponse);
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'response', content: data.aiResponse }
                ]);
                showToastSuccess('AI đã phản hồi!');
            } else {
                showToastError(data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            showToastError('Không thể gửi CV');
        }
    };
    

    return (
        <section className={styles.AI_banner_search}>
            <div className={styles.wrapper}>
                <div className={styles.result}>
                    {chatMessages.map((message, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${message.type === 'user' ? styles.user : styles.response}`}
                        >
                            {message.type === 'user' && message.content instanceof File ? (
                                <div className={styles.dispaly_file}>
                                    <FontAwesomeIcon icon={faFile} />
                                    <div className={styles.content}>
                                        <p>{message.content.name}</p>
                                        <span>PDF</span>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p>
                                        <strong>Kết quả GPT:</strong>
                                    </p>
                                    <p>{typeof message.content === 'string' ? message.content : message.content.name}</p>

                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.box}>
                    <h2>Bạn đang tìm việc gì ?</h2>
                    <div className={`${styles.box_search} ${selectedFile ? styles.expanded : ''}`}>
                        {selectedFile && (
                            <div className={styles.dispaly_file}>
                                <FontAwesomeIcon icon={faFile} />
                                <div>
                                    <p>{selectedFile.name}</p>
                                    <span>PDF</span>
                                </div>
                            </div>
                        )}

                        <input type="text" placeholder="Bằng cách nhập hoặc upload CV " />

                        <div className={styles.tool}>
                            <div>
                                <label htmlFor="uploadCv" className={styles.btn_uploadCv}>
                                    <input
                                        type="file"
                                        id="uploadCv"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    Upload CV
                                </label>
                            </div>

                            <div className={styles.search_AI} onClick={handleSendMessage}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CvParserService;
