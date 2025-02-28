'use client';
import { useState, useEffect } from 'react';
import styles from './updateProfie.module.scss';
import { showToastSuccess, showToastError } from 'app/Ultils/toast';
import axios from 'axios';
import Select from 'react-select';
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

interface UpdateProfileProps {
    isOpen: boolean;
    onClose: () => void;
    user?: {
        userId: string;
        jobTitle: string[];
        experienceLevel: string;
        industry: string;
        address: string;
        skills: string;
        education: string;
        nationality: string;
        dateOfBirth?: string;
        gender?: string;
        highestDegree: string;
        expectedSalary: number;
        phoneNumber: string;
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

const highestDegreeOptions = [
    { value: 'Trung học phổ thông', label: 'Trung học phổ thông' },
    { value: 'Trung cấp', label: 'Trung cấp' },
    { value: 'Cao đẳng', label: 'Cao đẳng' },
    { value: 'Đại học', label: 'Đại học' },
    { value: 'Thạc sĩ', label: 'Thạc sĩ' },
    { value: 'Tiến sĩ', label: 'Tiến sĩ' },
    { value: 'Khác', label: 'Khác' },
];

const genderOptions = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
    { value: 'Khác', label: 'Khác' },
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
        jobTitle: '',
        experienceLevel: '',
        industry: '',
        address: '',
        skills: '',
        education: '',
        expectedSalary: '',
        highestDegree: '',
        nationality: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
    });

    const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);
    const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);
    const [wards, setWards] = useState<{ value: string; label: string }[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<{ value: string; label: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ value: string; label: string } | null>(null);
    const [selectedWard, setSelectedWard] = useState<{ value: string; label: string } | null>(null);
    const [nationalOptions, setNationalOptions] = useState<{ value: string; label: string }[]>([]);

    // Lấy danh sách quốc gia từ API Rest Countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all');
                const countries = response.data.map((country: any) => ({
                    value: country.cca2,
                    label: country.name.common,
                }));

                // Tách Vietnam ra và đặt lên đầu
                const vietnam = countries.find((country: any) => country.value === 'VN');
                const otherCountries = countries
                    .filter((country: any) => country.value !== 'VN') // Loại Vietnam khỏi danh sách
                    .sort((a: any, b: any) => a.label.localeCompare(b.label)); // Sắp xếp các nước còn lại

                // Ghép lại với Vietnam đứng đầu
                const sortedCountries = vietnam ? [vietnam, ...otherCountries] : otherCountries;

                setNationalOptions(sortedCountries);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách quốc gia:', error);
                setNationalOptions([
                    { value: 'VN', label: 'Vietnam' }, // Vietnam vẫn đứng đầu trong fallback
                    { value: 'US', label: 'United States' },
                    { value: 'JP', label: 'Japan' },
                ]);
            }
        };
        fetchCountries();
    }, []);

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

    // Hàm chuẩn hóa số điện thoại
    const normalizePhoneNumber = (phone: string, countryCode: string) => {
        const phoneNumber = parsePhoneNumberFromString(phone, countryCode as any);
        if (phoneNumber && phoneNumber.isValid()) {
            return phoneNumber.nationalNumber;
        }
        return phone.replace(/\D/g, '');
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === 'expectedSalary') {
            const numericValue = value.replace(/\D/g, '');
            formattedValue = numericValue ? new Intl.NumberFormat('vi-VN').format(Number(numericValue)) : '';
        } else if (name === 'phoneNumber') {
            formattedValue = normalizePhoneNumber(value, formData.nationality);
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
        const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value).join(', ') : '';
        setFormData((prev) => ({ ...prev, jobTitle: selectedValues }));
    };

    const handleNationalityChange = (selectedOption: any) => {
        const newNationality = selectedOption?.value || '';
        const newPhoneNumber = formData.phoneNumber
            ? normalizePhoneNumber(formData.phoneNumber, newNationality)
            : formData.phoneNumber;
        setFormData((prev) => ({
            ...prev,
            nationality: newNationality,
            phoneNumber: newPhoneNumber,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        console.log('📌 Dữ liệu formData trước khi gửi:', formData);

        const access_token = localStorage.getItem('access_token');
        if (!access_token) return console.warn('⚠️ Không tìm thấy token, hủy request.');

        try {
            const changedData: any = {};
            Object.keys(formData).forEach((key) => {
                const formValue = formData[key as keyof typeof formData];
                const userValue =
                    user && key === 'jobTitle' ? (user?.jobTitle || []).join(', ') : user?.[key as keyof typeof user];

                if (formValue && formValue !== String(userValue)) {
                    if (key === 'expectedSalary') {
                        changedData[key] = parseInt(formValue.replace(/\D/g, ''), 10);
                    } else if (key === 'phoneNumber' && formData.nationality) {
                        const countryCallingCode = getCountryCallingCode(formData.nationality as any);
                        changedData[key] = `+${countryCallingCode}${formValue}`;
                    } else {
                        changedData[key] = formValue;
                    }
                }
            });

            if (Object.keys(changedData).length === 0) {
                showToastError('Không có thay đổi để cập nhật!');
                onClose();
                return;
            }

            console.log('📌 Dữ liệu thay đổi gửi lên backend:', changedData);

            const response = await axios.put(`${apiUrl}/users/updateProfile`, changedData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                withCredentials: true,
            });

            console.log('response: ', response);
            showToastSuccess('Cập nhật hồ sơ thành công!');
            onClose();
        } catch (error: any) {
            console.error('❌ Lỗi API:', error);
            if (error.response) {
                console.error('📌 Chi tiết lỗi:', error.response.data);
                if (error.response.status === 409) {
                    showToastError('❌ Số điện thoại đã được sử dụng bởi người dùng khác.');
                    return;
                }
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

    const formatOptionLabel = ({ value, label }: { value: string; label: string }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                src={`https://flagcdn.com/16x12/${value.toLowerCase()}.png`}
                alt={`${label} flag`}
                style={{ marginRight: '8px', width: '16px', height: '12px' }}
            />
            <span>{label}</span>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <h3>Cập nhật hồ sơ</h3>

                <div className={styles.form}>
                    <div className={styles.flex_phoneNumber}>
                        <div className={styles.box_national}>
                            <div className={styles.input_box}>
                                <label>Quốc gia:</label>
                                <Select
                                    className={styles.selectNational}
                                    options={nationalOptions}
                                    value={nationalOptions.find((option) => option.value === formData.nationality)}
                                    onChange={handleNationalityChange}
                                    placeholder={user?.nationality || 'Chọn quốc gia...'}
                                    formatOptionLabel={formatOptionLabel}
                                />
                            </div>
                        </div>

                        <div className={styles.box_phoneNumber}>
                            <div className={styles.input_box}>
                                <label>
                                    Số điện thoại (
                                    {formData.nationality
                                        ? `+${getCountryCallingCode(formData.nationality as any)}`
                                        : '+'}
                                    )
                                </label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder={user?.phoneNumber || 'Enter phone number'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.input_box}>
                            <label>Ngày sinh:</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                placeholder={user?.dateOfBirth || 'Chọn ngày sinh'}
                            />
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.input_box}>
                            <label>Giới tính:</label>
                            <Select
                                className={styles.selectGender}
                                options={genderOptions}
                                value={genderOptions.find((option) => option.value === formData.gender)}
                                onChange={(selectedOption) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        gender: selectedOption?.value || '',
                                    }))
                                }
                                placeholder={user?.gender || 'Chọn giới tính...'}
                            />
                        </div>
                    </div>
                </div>

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
                                    placeholder={user?.address || 'Nhập địa chỉ'}
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
                                <label>Mức độ kinh nghiệm:</label>
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
                                    placeholder={user?.experienceLevel || 'Chọn mức độ kinh nghiệm...'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.input_box}>
                            <label>Lĩnh vực:</label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                placeholder={user?.industry || 'Nhập lĩnh vực'}
                            />
                        </div>

                        <div className={styles.input_box}>
                            <label>Vị trí mong muốn</label>
                            <Select
                                className={styles.jobTitle}
                                isMulti
                                options={jobTitleOptions}
                                value={jobTitleOptions.filter((option) =>
                                    formData.jobTitle.split(', ').includes(option.value)
                                )}
                                onChange={handleExperienceJobTitleChange}
                                placeholder={(user?.jobTitle || []).join(', ') || 'Chọn vị trí mong muốn'}
                            />
                        </div>

                        <div className={styles.input_box}>
                            <label>Mức lương mong muốn: VNĐ/Tháng</label>
                            <input
                                type="text"
                                name="expectedSalary"
                                value={formData.expectedSalary}
                                onChange={handleChange}
                                placeholder={
                                    user?.expectedSalary
                                        ? new Intl.NumberFormat('vi-VN').format(user.expectedSalary)
                                        : 'Nhập mức lương'
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.input_box}>
                            <label>Học vấn</label>
                            <input
                                type="text"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                placeholder={user?.education || 'Nhập học vấn'}
                            />
                        </div>

                        <div className={styles.input_box}>
                            <label>Bằng cấp cao nhất:</label>
                            <Select
                                className={styles.selectDegree}
                                options={highestDegreeOptions}
                                value={highestDegreeOptions.find((option) => option.value === formData.highestDegree)}
                                onChange={(selectedOption) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        highestDegree: selectedOption?.value || '',
                                    }))
                                }
                                placeholder={user?.highestDegree || 'Chọn bằng cấp...'}
                            />
                        </div>

                        <div className={styles.input_box}>
                            <label>Kĩ năng</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder={user?.skills || 'Nhập kỹ năng'}
                            />
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
