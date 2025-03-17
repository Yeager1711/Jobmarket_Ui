'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';
import { isTokenExpired } from 'app/Ultils/check_TokenExpired/isTokenExpired';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

interface ApiContextType {
    user: any | null;
    accessToken: string | null;
    isReady: boolean;
    fetchUser: () => Promise<any>;
    FuncLogin: (email: string, password: string) => Promise<void>;
    Funclogout: () => void;
    fetchCVs: (userId: string) => Promise<any>;
    setDefaultCV: (resumeCVId: number) => Promise<boolean>;
    deleteCV: (resumeCVId: number) => Promise<boolean>;
    fetchAllJobs: () => Promise<any>;
    fetchJobsBySkip: (skip: number, take: number) => Promise<any>;
    updateUserProfile: (data: any) => Promise<any>;
    fetchCountries: () => Promise<any>;
    fetchProvinces: () => Promise<any>;
    updateEmail: (newEmail: string, currentPassword: string) => Promise<any>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<any>;
    fetchJobDetails: (jobId: number) => Promise<any>;
    addFavoriteJob: (jobId: number) => Promise<any>;
    getUserFavoriteJobs: () => Promise<any>;
    deleteAccountCurrent: () => Promise<boolean>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Lấy accessToken từ localStorage ngay khi mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('access_token');
            if (storedToken) {
                setAccessToken(storedToken);
            }
            setIsReady(true);
        }
    }, []);

    // Check Auth Header
    const getAuthHeaders = () => {
        if (!accessToken) {
            // showToastError('Không tìm thấy token, vui lòng đăng nhập lại');
            throw new Error('No token');
        }
        if (isTokenExpired(accessToken)) {
            showToastError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            localStorage.removeItem('access_token');
            setAccessToken(null);
            setUser(null);
            throw new Error('Token expired');
        }
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        };
    };

    // Fetch User
    const fetchUser = useCallback(async () => {
        if (!accessToken) {
            console.warn('fetchUser: Không có accessToken, bỏ qua fetch.');
            return;
        }
        try {
            const headers = getAuthHeaders();
            const response = await axios.get(`${apiUrl}/users/getUserId`, { headers });
            setUser(response.data);
            return response.data;
        } catch (error: any) {
            console.error('Lỗi fetchUser:', error.response?.data || error.message);
            throw error;
        }
    }, [accessToken]);

    // Login
    const FuncLogin = useCallback(
        async (email: string, password: string) => {
            try {
                const response = await axios.post(
                    `${apiUrl}/auth/login`,
                    { email, password },
                    { withCredentials: true }
                );
                const token = response.data.accessToken;
                localStorage.setItem('access_token', token);
                setAccessToken(token);

                // Đợi setAccessToken cập nhật xong trước khi gọi fetchUser
                await new Promise((resolve) => setTimeout(resolve, 100));

                await fetchUser();
                showToastSuccess('Đăng nhập thành công');
            } catch (error: any) {
                console.error('Lỗi khi đăng nhập:', error);
                throw error;
            }
        },
        [fetchUser]
    );

    // Logout
    const Funclogout = useCallback(() => {
        localStorage.removeItem('access_token');
        setAccessToken(null);
        setUser(null);
        showToastSuccess('Đăng xuất thành công');
    }, []);

    // Kiểm tra token và lấy thông tin user khi accessToken thay đổi
    useEffect(() => {
        if (isReady && accessToken && !user) {
            fetchUser();
        }
    }, [accessToken, user, isReady, fetchUser]);

    // Các API khác giữ nguyên
    const fetchCVs = useCallback(
        async (userId: string) => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.get(`${apiUrl}/users/getCv/${userId}`, { headers });
                return response.data;
            } catch (error: any) {
                console.error('Lỗi khi lấy danh sách CV:', error);
                showToastError('Không thể tải danh sách CV');
                throw error;
            }
        },
        [accessToken]
    );

    const setDefaultCV = useCallback(
        async (resumeCVId: number) => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.put(`${apiUrl}/users/setDefaultCV/${resumeCVId}`, {}, { headers });
                showToastSuccess(response.data.message || 'Đặt CV mặc định thành công');
                return true;
            } catch (error: any) {
                console.error('Lỗi khi đặt CV mặc định:', error);
                showToastError(error.response?.data?.message || 'Lỗi khi đặt CV mặc định');
                return false;
            }
        },
        [accessToken]
    );

    const deleteCV = useCallback(
        async (resumeCVId: number) => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.delete(`${apiUrl}/users/deleteCV/${resumeCVId}`, { headers });
                showToastSuccess('Xóa CV thành công');
                return true;
            } catch (error: any) {
                console.error('Lỗi khi xóa CV:', error);
                showToastError('Xóa CV thất bại');
                return false;
            }
        },
        [accessToken]
    );

    const updateUserProfile = useCallback(
        async (data: any) => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.put(`${apiUrl}/users/updateProfile`, data, {
                    headers,
                    withCredentials: true,
                });
                showToastSuccess('Cập nhật hồ sơ thành công!');
                return response.data;
            } catch (error: any) {
                console.error('Lỗi khi cập nhật hồ sơ:', error);
                if (error.response) {
                    if (error.response.status === 409) {
                        showToastError('Số điện thoại đã được sử dụng bởi người dùng khác.');
                    } else {
                        showToastError(error.response.data?.message || 'Lỗi khi cập nhật hồ sơ');
                    }
                } else if (error.request) {
                    showToastError('Máy chủ không phản hồi, vui lòng thử lại.');
                } else {
                    showToastError('Có lỗi xảy ra khi cập nhật hồ sơ');
                }
                throw error;
            }
        },
        [accessToken]
    );

    const updateEmail = useCallback(
        async (newEmail: string, currentPassword: string) => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.put(
                    `${apiUrl}/users/update-email`,
                    { newEmail, currentPassword },
                    { headers }
                );
                return response.data;
            } catch (error: any) {
                console.error('Lỗi khi cập nhật email:', error);
                throw error;
            }
        },
        [accessToken]
    );

    const changePassword = useCallback(
        async (currentPassword: string, newPassword: string) => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.put(
                    `${apiUrl}/users/change-password`,
                    { currentPassword, newPassword },
                    { headers }
                );
                return response.data;
            } catch (error: any) {
                console.error('Lỗi khi đổi mật khẩu:', error);
                throw error;
            }
        },
        [accessToken]
    );

    const deleteAccountCurrent = useCallback(async () => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.delete(`${apiUrl}/users/deleteUserCurrent`, { headers });
            if (response.status === 200) {
                showToastSuccess('Tài khoản đã được xóa thành công');
                localStorage.removeItem('access_token');
                setAccessToken(null);
                window.location.href = '/login';
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Lỗi khi xóa tài khoản:', error.response?.data || error.message);
            showToastError(error.response?.data?.message || 'Xóa tài khoản thất bại');
            return false;
        }
    }, [accessToken]);

    const fetchAllJobs = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/jobs/all-jobs`);
            return response.data;
        } catch (error: any) {
            console.error('Lỗi khi lấy danh sách công việc:', error);
            showToastError('Không thể tải danh sách công việc');
            throw error;
        }
    }, []);

    const fetchJobsBySkip = useCallback(async (skip: number, take: number) => {
        try {
            const response = await axios.get(`${apiUrl}/jobs/job_skip?skip=${skip}&take=${take}`);
            return response.data;
        } catch (error: any) {
            console.error('Lỗi khi lấy danh sách công việc phân trang:', error);
            showToastError('Không thể tải danh sách công việc');
            throw error;
        }
    }, []);

    const fetchJobDetails = useCallback(async (jobId: number) => {
        try {
            const response = await fetch(`${apiUrl}/jobs/${jobId}`);
            const { data } = await response.json();
            return data;
        } catch (error: any) {
            showToastError('Không thể tải chi tiết công việc');
            console.log('Không thể tải chi tiết công việc');
        }
    }, []);

    const addFavoriteJob = useCallback(
        async (jobId: number) => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.post(`${apiUrl}/favorite/favorite-job`, { jobId }, { headers });
                showToastSuccess(response.data.message || 'Đã thêm công việc vào danh sách yêu thích');
                return response.data;
            } catch (error: any) {
                console.error('Lỗi khi thêm công việc yêu thích:', error);
                showToastError(error.response?.data?.message || 'Không thể thêm công việc vào danh sách yêu thích');
                throw error;
            }
        },
        [accessToken]
    );

    const getUserFavoriteJobs = useCallback(async () => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.get(`${apiUrl}/favorite/user-favorites`, { headers });
            return response.data.data;
        } catch (error: any) {
            console.error('Lỗi khi lấy danh sách công việc yêu thích:', error);
            showToastError('Không thể tải danh sách công việc yêu thích');
            throw error;
        }
    }, [accessToken]);

    const fetchCountries = useCallback(async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            return response.data;
        } catch (error: any) {
            console.error('Lỗi khi lấy danh sách quốc gia:', error);
            showToastError('Không thể tải danh sách quốc gia');
            throw error;
        }
    }, []);

    const fetchProvinces = useCallback(async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/?depth=2');
            return response.data;
        } catch (error: any) {
            console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
            showToastError('Không thể tải danh sách tỉnh/thành phố');
            throw error;
        }
    }, []);

    return (
        <ApiContext.Provider
            value={{
                user,
                isReady,
                accessToken,
                fetchUser,
                FuncLogin,
                Funclogout,
                fetchCVs,
                setDefaultCV,
                deleteCV,
                fetchAllJobs,
                fetchJobsBySkip,
                updateUserProfile,
                fetchCountries,
                fetchProvinces,
                updateEmail,
                changePassword,
                fetchJobDetails,
                addFavoriteJob,
                getUserFavoriteJobs,
                deleteAccountCurrent,
            }}
        >
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi phải được sử dụng trong ApiProvider');
    }
    return context;
};
