'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { showToastError, showToastSuccess } from 'app/Ultils/toast';
import { isTokenExpired } from 'app/Ultils/check_TokenExpired/isTokenExpired';

const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

interface ApiContextType {
    fetchUser: () => Promise<any>;
    fetchCVs: (userId: string) => Promise<any>;
    setDefaultCV: (resumeCVId: number) => Promise<boolean>;
    deleteCV: (resumeCVId: number) => Promise<boolean>;
    fetchAllJobs: () => Promise<any>;
    fetchJobsBySkip: (skip: number, take: number) => Promise<any>;
    updateUserProfile: (data: any) => Promise<any>;
    fetchCountries: () => Promise<any>;
    fetchProvinces: () => Promise<any>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'));

    const getAuthHeaders = () => {
        if (!accessToken) {
            showToastError('Không tìm thấy token, vui lòng đăng nhập lại');
            throw new Error('No token');
        }

        if (isTokenExpired(accessToken)) {
            showToastError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            localStorage.removeItem('access_token');
            setAccessToken(null);
            throw new Error('Token expired');
        }

        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        };
    };

    const fetchUser = useCallback(async () => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.get(`${apiUrl}/users/getUserId`, { headers });
            return response.data;
        } catch (error: any) {
            console.error('Lỗi khi lấy dữ liệu user:', error);
            showToastError('Không thể tải thông tin người dùng');
            throw error;
        }
    }, [accessToken]);

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

    // fetchAllJobs không cần accessToken
    const fetchAllJobs = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/jobs/all-jobs`);
            return response.data; // Trả về dữ liệu từ API
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

    // Thêm API cập nhật profile
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

    // Thêm API lấy danh sách quốc gia
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

    // Thêm API lấy danh sách tỉnh/thành phố
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
                fetchUser,
                fetchCVs,
                setDefaultCV,
                deleteCV,
                fetchAllJobs,
                fetchJobsBySkip,
                updateUserProfile,
                fetchCountries,
                fetchProvinces,
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
