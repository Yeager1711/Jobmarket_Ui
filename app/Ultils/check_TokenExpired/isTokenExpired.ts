import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: any = jwtDecode(token);
        const expirationTime = decoded.exp * 1000;
        return expirationTime < Date.now();
    } catch (error) {
        console.error('Lỗi khi giải mã token:', error);
        return true; 
    }
};