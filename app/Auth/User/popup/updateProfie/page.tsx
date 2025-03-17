'use client';
import { useState, useEffect } from 'react';
import styles from './updateProfie.module.scss';
import { showToastError } from 'app/Ultils/toast';
import Select from 'react-select';
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js';
import { useApi } from '../../../../Context/ApiContext/ApiContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSnowflake } from '@fortawesome/free-solid-svg-icons';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface UpdateProfileProps {
    isOpen: boolean;
    onClose: () => void;
    firstName?: string;
    lastName?: string;
    user?: {
        userId: number;
        firstName?: string;
        lastName?: string;
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
        yearOfNumberExperience: string;
    };
}

const yearOfNumberExperienceOptions = [
    { value: 'Chưa có kinh nghiệm', label: 'Chưa có kinh nghiệm' },
    { value: 'Dưới 1 năm', label: 'Dưới 1 năm' },
    { value: '1 năm', label: '1 năm' },
    { value: '2 năm', label: '2 năm' },
    { value: '3 năm', label: '3 năm' },
    { value: '4 năm', label: '4 năm' },
    { value: '5 năm', label: '5 năm' },
    { value: '6 năm', label: '6 năm' },
    { value: '7 năm', label: '7 năm' },
    { value: '8 năm', label: '8 năm' },
    { value: '9 năm', label: '9 năm' },
    { value: '10 năm', label: '10 năm' },
    { value: 'Trên 10 năm', label: 'Trên 10 năm' },
];

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

function UpdateProfileModal({ isOpen, onClose, user, firstName, lastName }: UpdateProfileProps) {
    const [formData, setFormData] = useState({
        jobTitle: user?.jobTitle?.join(', ') || '',
        experienceLevel: user?.experienceLevel || '',
        industry: user?.industry || '',
        address: user?.address || '',
        skills: user?.skills || '',
        education: user?.education || '',
        expectedSalary: user?.expectedSalary ? new Intl.NumberFormat('vi-VN').format(user.expectedSalary) : '',
        highestDegree: user?.highestDegree || '',
        nationality: user?.nationality || 'VN',
        dateOfBirth: user?.dateOfBirth || '',
        gender: user?.gender || '',
        phoneNumber: user?.phoneNumber || '',
        yearOfNumberExperience: user?.yearOfNumberExperience || '',
    });

    const [provinces, setProvinces] = useState<{ value: string; label: string; districts: any[] }[]>([]);
    const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);
    const [wards, setWards] = useState<{ value: string; label: string }[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<{ value: string; label: string; districts: any[] } | null>(
        null
    );
    const [selectedDistrict, setSelectedDistrict] = useState<{ value: string; label: string } | null>(null);
    const [selectedWard, setSelectedWard] = useState<{ value: string; label: string } | null>(null);
    const [nationalOptions, setNationalOptions] = useState<{ value: string; label: string }[]>([]);

    const { updateUserProfile, fetchCountries, fetchProvinces } = useApi();

    useEffect(() => {
        const loadCountries = async () => {
            try {
                const data = await fetchCountries();
                const countries = data.map((country: any) => ({
                    value: country.cca2,
                    label: country.name.common,
                }));

                const vietnam = countries.find((country: any) => country.value === 'VN');
                const otherCountries = countries
                    .filter((country: any) => country.value !== 'VN')
                    .sort((a: any, b: any) => a.label.localeCompare(b.label));
                const sortedCountries = vietnam ? [vietnam, ...otherCountries] : otherCountries;

                setNationalOptions(sortedCountries);
            } catch (error) {
                setNationalOptions([
                    { value: 'VN', label: 'Vietnam' },
                    { value: 'US', label: 'United States' },
                    { value: 'JP', label: 'Japan' },
                ]);
            }
        };
        loadCountries();
    }, [fetchCountries]);

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const data = await fetchProvinces();
                const provinceOptions = data.map((province: any) => ({
                    value: province.code,
                    label: province.name,
                    districts: province.districts,
                }));
                setProvinces(provinceOptions);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
            }
        };
        loadProvinces();
    }, [fetchProvinces]);

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

    const handleExperienceLevelChange = (selectedOption: any) => {
        const newExperienceLevel = selectedOption?.value || '';
        setFormData((prev) => {
            let newYearOfNumberExperience = prev.yearOfNumberExperience;

            if (newExperienceLevel === 'Mới ra trường' && prev.yearOfNumberExperience !== 'Dưới 1 năm') {
                newYearOfNumberExperience = 'Dưới 1 năm';
            }
            if (newExperienceLevel === 'Thưc tập sinh/Sinh viên') {
                newYearOfNumberExperience = 'Chưa có kinh nghiệm';
            }
            if (
                ['Nhân viên', 'Trưởng phòng', 'Giám đốc và cấp cao hơn'].includes(newExperienceLevel) &&
                newYearOfNumberExperience === 'Chưa có kinh nghiệm'
            ) {
                newYearOfNumberExperience = '';
            }

            return {
                ...prev,
                experienceLevel: newExperienceLevel,
                yearOfNumberExperience: newYearOfNumberExperience,
            };
        });
    };

    const handleYearOfNumberExperienceChange = (selectedOption: any) => {
        const newYearOfNumberExperience = selectedOption?.value || '';
        setFormData((prev) => ({ ...prev, yearOfNumberExperience: newYearOfNumberExperience }));
    };

    const getFilteredYearOptions = () => {
        if (formData.experienceLevel === 'Mới ra trường') {
            return yearOfNumberExperienceOptions.map((option) => ({
                ...option,
                isDisabled: option.value !== 'Dưới 1 năm',
            }));
        }
        if (formData.experienceLevel === 'Thưc tập sinh/Sinh viên') {
            return yearOfNumberExperienceOptions.map((option) => ({
                ...option,
                isDisabled: true,
            }));
        }
        if (['Nhân viên', 'Trưởng phòng', 'Giám đốc và cấp cao hơn'].includes(formData.experienceLevel)) {
            return yearOfNumberExperienceOptions.map((option) => ({
                ...option,
                isDisabled: option.value === 'Chưa có kinh nghiệm',
            }));
        }
        return yearOfNumberExperienceOptions;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        console.log('📌 Dữ liệu formData trước khi gửi:', formData);

        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            console.warn('⚠️ Không tìm thấy token, hủy request.');
            return;
        }

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

            await updateUserProfile(changedData);
            onClose();
        } catch (error) {
            // Lỗi đã được xử lý trong context
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
                <div className={styles.postion_img1}>
                    <svg width="412" height="130" viewBox="0 0 412 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M446.116 123.629C446.119 123.635 446.113 123.641 446.107 123.638C390.586 94.6806 315.718 93.4027 310.568 93.3488C310.366 93.3467 310.184 93.3436 309.982 93.3375C227.379 90.8637 159.982 62.0166 153.185 59.0181C152.779 58.8391 152.415 58.6865 152.002 58.5245C97.8553 37.2806 47.2625 0.452444 43.4134 -2.37688C43.2388 -2.50522 43.091 -2.61158 42.9135 -2.73577C33.9569 -8.99984 24.1749 -14.8417 14.6375 -20.0437C-3.93921 -30.176 -3.94475 -57.0273 16.1876 -63.1258C68.4513 -78.9576 154.597 -96.6899 250.599 -82.5096C250.9 -82.4652 251.124 -82.4351 251.426 -82.3984C260.804 -81.2562 444.36 -56.7159 470.854 117.326C472.228 126.308 462.579 132.685 454.416 128.172L446.125 123.62C446.119 123.617 446.113 123.623 446.116 123.629Z"
                            fill="url(#paint0_linear_29878_282335)"
                            fillOpacity="0.2"
                        ></path>
                        <defs>
                            <linearGradient
                                id="paint0_linear_29878_282335"
                                x1="289.315"
                                y1="-188.344"
                                x2="104.419"
                                y2="338.095"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#82DCFF"></stop>
                                <stop offset="0.32" stopColor="#D4E4FF"></stop>
                                <stop offset="0.76" stopColor="#0047CC"></stop>
                                <stop offset="1" stopColor="#002466"></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className={styles.postion_img2}>
                    <svg width="313" height="295" viewBox="0 0 313 295" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M-79.8671 7.08921C-79.8661 7.08291 -79.8579 7.08077 -79.8553 7.0866C-49.8027 73.2259 45.5915 233.247 298.167 341.306C318.347 349.939 318.009 377.068 296.635 382.063C215.191 401.097 66.2578 415.619 -45.7692 310.704C-45.9381 310.546 -46.0552 310.438 -46.2261 310.282C-51.5496 305.424 -161.006 202.541 -102.484 8.38912C-99.3496 -2.08324 -84.4704 -2.94093 -79.8795 7.09059C-79.8768 7.09639 -79.8681 7.09551 -79.8671 7.08921Z"
                            fill="url(#paint0_linear_29878_282334)"
                            fillOpacity="0.2"
                        ></path>
                        <defs>
                            <linearGradient
                                id="paint0_linear_29878_282334"
                                x1="-97.2294"
                                y1="365.187"
                                x2="336.727"
                                y2="41.5518"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#002466"></stop>
                                <stop offset="0.114147" stopColor="#0047CC"></stop>
                                <stop offset="0.435625" stopColor="#D4E4FF"></stop>
                                <stop offset="1" stopColor="#82DCFF"></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className={styles.postion_img1}></div>
                <h3>Cập nhật hồ sơ</h3>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={50}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    navigation
                    allowTouchMove={false}
                    className="mySwiper_popupUpdate"
                >
                    {/* Slide 1: Giới thiệu về Jobmarket */}
                    <SwiperSlide>
                        <div className={styles.introduction_jobmarket}>
                            <h1>
                               {firstName} {lastName}, Chào mừng đến với <p>Job Market</p>
                            </h1>
                        </div>
                    </SwiperSlide>
                    {/* Slide 1: Quốc gia, Số điện thoại, Ngày sinh, Giới tính */}
                    <SwiperSlide>
                        <div className={styles.form}>
                            <div className={styles.box}>
                                <div className={styles.flex_phoneNumber}>
                                    <div className={styles.box_national}>
                                        <div className={styles.input_box}>
                                            <label>Quốc gia:</label>
                                            <Select
                                                className={styles.selectNational}
                                                options={nationalOptions}
                                                value={nationalOptions.find(
                                                    (option) => option.value === formData.nationality
                                                )}
                                                onChange={handleNationalityChange}
                                                placeholder={user?.nationality || 'Chọn quốc gia...'}
                                                formatOptionLabel={formatOptionLabel}
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
                                        placeholder={user?.gender || ''}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 2: Địa chỉ, Mức độ kinh nghiệm, Số năm kinh nghiệm */}
                    <SwiperSlide>
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
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '2rem' }}>
                                        <div className={styles.input_box}>
                                            <label>Mức độ kinh nghiệm:</label>
                                            <Select
                                                className={styles.selectExperience}
                                                options={experienceLevelOptions}
                                                value={experienceLevelOptions.find(
                                                    (option) => option.value === formData.experienceLevel
                                                )}
                                                onChange={handleExperienceLevelChange}
                                                placeholder={user?.experienceLevel || ''}
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>

                                        <div className={styles.input_box}>
                                            <label>Số năm kinh nghiệm:</label>
                                            <Select
                                                className={styles.selectExperience}
                                                options={getFilteredYearOptions()}
                                                value={yearOfNumberExperienceOptions.find(
                                                    (option) => option.value === formData.yearOfNumberExperience
                                                )}
                                                onChange={handleYearOfNumberExperienceChange}
                                                placeholder={user?.yearOfNumberExperience || ''}
                                                isOptionDisabled={(option: any) => option.isDisabled || false}
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 3: Lĩnh vực, Vị trí mong muốn, Mức lương mong muốn */}
                    <SwiperSlide>
                        <div className={styles.form}>
                            <div className={styles.box}>
                                <div className={styles.input_box}>
                                    <label>Lĩnh vực:</label>
                                    <input
                                        type="text"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        placeholder={user?.industry || ''}
                                    />
                                </div>

                                <div className={styles.input_box}>
                                    <label>Vị trí mong muốn:</label>
                                    <Select
                                        className={styles.jobTitle}
                                        isMulti
                                        options={jobTitleOptions}
                                        value={jobTitleOptions.filter((option) =>
                                            formData.jobTitle.split(', ').includes(option.value)
                                        )}
                                        onChange={handleExperienceJobTitleChange}
                                        placeholder={(user?.jobTitle || []).join(', ') || ''}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    />
                                </div>

                                <div className={styles.input_box}>
                                    <label>Mức lương mong muốn (VNĐ/Tháng)</label>
                                    <input
                                        type="text"
                                        name="expectedSalary"
                                        value={formData.expectedSalary}
                                        onChange={handleChange}
                                        placeholder={
                                            user?.expectedSalary
                                                ? new Intl.NumberFormat('vi-VN').format(user.expectedSalary)
                                                : ''
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 4: Học vấn, Bằng cấp cao nhất, Kỹ năng */}
                    <SwiperSlide>
                        <div className={styles.form}>
                            <div className={styles.box}>
                                <div className={styles.input_box}>
                                    <label>Học vấn:</label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        placeholder={user?.education || ''}
                                    />
                                </div>

                                <div className={styles.input_box}>
                                    <label>Bằng cấp cao nhất:</label>
                                    <Select
                                        className={styles.selectDegree}
                                        options={highestDegreeOptions}
                                        value={highestDegreeOptions.find(
                                            (option) => option.value === formData.highestDegree
                                        )}
                                        onChange={(selectedOption) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                highestDegree: selectedOption?.value || '',
                                            }))
                                        }
                                        placeholder={user?.highestDegree || ''}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    />
                                </div>

                                <div className={styles.input_box}>
                                    <label>Kỹ năng:</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder={user?.skills || ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>

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
