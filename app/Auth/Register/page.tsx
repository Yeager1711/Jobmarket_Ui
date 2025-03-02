'use client';
import { useState, useEffect } from 'react';
import styles from './Register.module.scss';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

function Register() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
        nationality: '', // Thêm nationality để lưu mã ISO quốc gia
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [nationalOptions, setNationalOptions] = useState<{ value: string; label: string }[]>([]);

    // Lấy danh sách quốc gia từ API Rest Countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all');
                const countries = response.data
                    .map((country: any) => ({
                        value: country.cca2, // Mã ISO alpha-2
                        label: country.name.common, // Tên quốc gia
                    }))
                    .sort((a: any, b: any) => a.label.localeCompare(b.label)); // Sắp xếp theo tên
                setNationalOptions(countries);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách quốc gia:', error);
                setNationalOptions([
                    { value: 'VN', label: 'Vietnam' },
                    { value: 'US', label: 'United States' },
                    { value: 'JP', label: 'Japan' },
                ]);
            }
        };
        fetchCountries();
    }, []);

    // Hàm chuẩn hóa số điện thoại
    const normalizePhoneNumber = (phone: string, countryCode: string) => {
        const phoneNumber = parsePhoneNumberFromString(phone, countryCode as any);
        if (phoneNumber && phoneNumber.isValid()) {
            return phoneNumber.nationalNumber; // Trả về số quốc gia, loại bỏ 0 đầu
        }
        return phone.replace(/\D/g, ''); // Nếu không hợp lệ, chỉ giữ lại số
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        let formattedValue = value;

        if (name === 'phoneNumber') {
            formattedValue = normalizePhoneNumber(value, formData.nationality || 'VN'); // Mặc định VN nếu chưa chọn
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : formattedValue,
        }));
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

    const handleSubmit = async () => {
        if (!formData.agreeToTerms) {
            setError('Bạn phải đồng ý với điều khoản sử dụng!');
            return;
        }

        if (!formData.nationality) {
            setError('Vui lòng chọn quốc gia!');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const countryCallingCode = getCountryCallingCode(formData.nationality as any);
            const formattedPhoneNumber = `+${countryCallingCode}${formData.phoneNumber}`;

            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formattedPhoneNumber,
                    email: formData.email,
                    password: formData.password,
                    nationality: formData.nationality
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng ký thất bại, vui lòng thử lại.');
            }

            router.push('/');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Tùy chỉnh hiển thị option với cờ
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

    return (
        <section className={styles.Register}>
            <div className={styles.wrapper}>
                <h3>Đăng ký thành viên</h3>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.box_container}>
                    <div className={styles.flex_fullname}>
                        <div className={styles.box_input}>
                            <span>Họ</span>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                        </div>

                        <div className={styles.box_input}>
                            <span>Tên</span>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.box_input}>
                        <span>Quốc gia</span>
                        <Select
                            options={nationalOptions}
                            value={nationalOptions.find((option) => option.value === formData.nationality)}
                            onChange={handleNationalityChange}
                            placeholder="Chọn quốc gia..."
                            formatOptionLabel={formatOptionLabel} // Hiển thị cờ
                        />
                    </div>

                    <div className={styles.box_input}>
                        <span>
                            Số điện thoại (
                            {formData.nationality ? `+${getCountryCallingCode(formData.nationality as any)}` : '+'})
                        </span>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder={
                                formData.nationality === 'VN' ? '' : 'Enter phone number'
                            }
                        />
                    </div>

                    <div className={styles.box_input}>
                        <span>Email</span>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="(@gmail.com) và là Email thật để xác thực"
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className={styles.box_input}>
                        <span>Mật khẩu</span>
                        <div className={styles.password_wrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt"
                            />
                            <button
                                type="button"
                                className={styles.eye_icon}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                ) : (
                                    <FontAwesomeIcon icon={faEye} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className={styles.box_input}>
                        <span>Xác nhận mật khẩu</span>
                        <div className={styles.password_wrapper}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className={styles.eye_icon}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                ) : (
                                    <FontAwesomeIcon icon={faEye} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={styles.policy_wrapper}>
                        <label htmlFor="checkbox" className={styles.checkbox_container}>
                            <input
                                type="checkbox"
                                id="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                            />
                        </label>
                        <label className={styles.accept_text}>
                            Tôi đồng ý với <a href="#">Thoả thuận</a> sử dụng và <a href="#">Quy định bảo mật</a> của
                            JobMarket.
                        </label>
                    </div>

                    <button className={styles.btn_register} onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>

                    <div className={styles.policy_question}>
                        <span>Bạn là thành viên của JobMarket ? </span>
                        <a href="/Auth/Login">Đăng nhập</a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;