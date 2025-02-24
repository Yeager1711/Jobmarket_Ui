'use client';
import { useState, useEffect } from 'react';
import styles from './updateProfie.module.scss';
import { showToastSuccess, showToastError } from 'app/Ultils/toast';
import axios from 'axios';
import Select from 'react-select';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

interface UpdateProfileProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        userId: string;
        jobTitle: string[];
        experienceLevel: string;
        industry: string;
        address: string;
        skills: string;
        education: string;
        expectedSalary: number;
    };
    onUpdate: (updatedUser: any) => void;
}

const experienceLevelOptions = [
    { value: 'Thưc tập sinh/Sinh viên', label: 'Thưc tập sinh/Sinh viên' },
    { value: 'Mới ra trường', label: 'Mới ra trường' },
    { value: 'Nhân viên', label: 'Nhân viên' },
    { value: 'Trưởng phòng', label: 'Trưởng phòng' },
    { value: 'Giám đốc và cấp cao hơn', label: 'Giám đốc và cấp cao hơn' },
];

const jobTitleOptions = [
    { value: 'Intern', label: 'Intern' },
    { value: 'Fresher', label: 'Fresher' },
    { value: 'Junior', label: 'Junior' },
    { value: 'Mid-level', label: 'Mid-level' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Expert', label: 'Expert' },
];

function UpdateProfileModal({ isOpen, onClose, user }: UpdateProfileProps) {
    const [formData, setFormData] = useState({
        jobTitle: user?.jobTitle || [],
        experienceLevel: user?.experienceLevel || '',
        industry: user?.industry || '',
        address: user?.address || '',
        skills: user?.skills || '',
        education: user?.education || '',
        expectedSalary: user?.expectedSalary || '',
    });

    const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);
    const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);
    const [wards, setWards] = useState<{ value: string; label: string }[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<{ value: string; label: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ value: string; label: string } | null>(null);
    const [selectedWard, setSelectedWard] = useState<{ value: string; label: string } | null>(null);

    // State cho danh sách trường đại học
    const [universities, setUniversities] = useState<{ value: string; label: string }[]>([]);

    // Lấy danh sách tỉnh/thành phố từ API
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/?depth=2');
                const provinceOptions = response.data.map((province: any) => ({
                    value: province.code,
                    label: province.name,
                    districts: province.districts,
                }));
                setProvinces(provinceOptions);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
            }
        };

        fetchProvinces();
    }, []);

    // Lấy danh sách trường đại học từ API
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get('https://university-api-6gh0.onrender.com/api/v1/university');
                const universityOptions = response.data.data.map((university: any) => ({
                    value: university.name,
                    label: university.name,
                }));
                setUniversities(universityOptions);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách trường đại học:', error);
            }
        };

        fetchUniversities();
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === 'expectedSalary') {
            const numericValue = value.replace(/\D/g, '');

            formattedValue = new Intl.NumberFormat('vi-VN').format(Number(numericValue));
        }
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    const handleProvinceChange = (selectedOption: any) => {
        setSelectedProvince(selectedOption);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts(
            selectedOption.districts.map((district: any) => ({
                value: district.code,
                label: district.name,
            }))
        );
        setFormData((prev) => ({ ...prev, address: selectedOption.label }));
    };

    const handleDistrictChange = (selectedOption: any) => {
        setSelectedDistrict(selectedOption);
        setSelectedWard(null);
        if (selectedOption?.wards) {
            const wardOptions = selectedOption.wards.map((ward: any) => ({
                value: ward.code,
                label: ward.name,
            }));
            setWards(wardOptions);
        } else {
            setWards([]);
        }

        setFormData((prev) => ({ ...prev, address: `${selectedOption.label}, ${selectedProvince?.label}` }));
    };

    const handleExperienceJobTitleChange = (selectedOptions: any) => {
        const selectedValues = selectedOptions.map((option: any) => option.value);
        setFormData((prev) => ({ ...prev, jobTitle: selectedValues }));
    };

    const handleUniversityChange = (selectedOption: any) => {
        setFormData((prev) => ({ ...prev, education: selectedOption?.value || '' }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        console.log('📌 Dữ liệu formData trước khi gửi:', formData);

        const access_token = localStorage.getItem('access_token');
        if (!access_token) return console.warn('⚠️ Không tìm thấy token, hủy request.');

        try {
            const decoded: any = jwtDecode(access_token);
            const userId = decoded?.userId;

            const formattedData = {
                ...formData,
                jobTitle: Array.isArray(formData.jobTitle) ? formData.jobTitle.join(', ') : formData.jobTitle,
                expectedSalary: parseInt(formData.expectedSalary.toString().replace(/\D/g, ''), 10),
            };

            const response = await axios.put(`${apiUrl}/users/updateProfile/${userId}`, formattedData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                withCredentials: true,
            });

            showToastSuccess('Cập nhật hồ sơ thành công!');

            
            onClose();
        } catch (error: any) {
            console.error('❌ Lỗi API:', error);

            if (error.response) {
                // Lấy message từ API nếu có
                const errorMessage = error.response.data?.message || 'Lỗi không xác định từ server.';
                showToastError(`❌ ${errorMessage}`);
            } else if (error.request) {
                showToastError('❌ Máy chủ không phản hồi, vui lòng thử lại.');
            } else {
                showToastError('❌ Có lỗi xảy ra, vui lòng thử lại.');
            }
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <h3>Cập nhật hồ sơ </h3>
                <div className={styles.form}>
                    <div className={styles.box}>
                        <div className={styles.input_box}>
                            <div className={styles.flexProvince}>
                                <label>Địa chỉ:</label>

                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    readOnly
                                    style={{ marginBottom: '2rem' }}
                                    disabled
                                />
                                <Select
                                    className={styles.region}
                                    options={provinces}
                                    onChange={handleProvinceChange}
                                    placeholder="Chọn tỉnh/thành phố..."
                                    value={selectedProvince}
                                />

                                {selectedProvince && (
                                    <div className={styles.input_box}>
                                        <label>Quận/Huyện:</label>
                                        <Select
                                            className={styles.districts}
                                            options={districts}
                                            onChange={handleDistrictChange}
                                            placeholder="Chọn quận/huyện..."
                                            value={selectedDistrict}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={styles.input_box}>
                                <label>Mức độ kinh nghiệm: </label>
                                <Select
                                    className={styles.selectExperience}
                                    options={experienceLevelOptions}
                                    value={experienceLevelOptions.find(
                                        (option) => option.value === formData.experienceLevel
                                    )}
                                    onChange={(selectedOption) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            experienceLevel: selectedOption?.value || '',
                                        }))
                                    }
                                    placeholder="Chọn mức độ kinh nghiệm..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.input_box}>
                            <label>Lĩnh vực:</label>
                            <input type="text" name="industry" value={formData.industry} onChange={handleChange} />
                        </div>

                        <div className={styles.input_box}>
                            <label>Vị trí mong muốn </label>
                            <Select
                                className={styles.jobTitle}
                                isMulti
                                options={jobTitleOptions}
                                value={jobTitleOptions.filter((option) => formData.jobTitle.includes(option.value))}
                                onChange={handleExperienceJobTitleChange}
                                placeholder="Vị trí mong muốn"
                            />
                        </div>

                        <div className={styles.input_box}>
                            <label>Mức lương mong muốn: VNĐ/Tháng</label>
                            <input
                                type="text"
                                name="expectedSalary"
                                value={formData.expectedSalary}
                                onChange={handleChange}
                                placeholder="Mức lương tối thiểu 1.000.0000 VNĐ"
                            />
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.input_box}>
                            <label>Học vấn </label>
                            <input type="text" name="education" value={formData.education} onChange={handleChange} />
                        </div>

                        <div className={styles.input_box}>
                            <label>Kĩ năng </label>
                            <input type="text" name="skills" value={formData.skills} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button type="button" className={styles.closeButton} onClick={onClose}>
                        Hủy
                    </button>
                    <button type="submit" className={styles.saveButton} onClick={handleSubmit}>
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateProfileModal;
