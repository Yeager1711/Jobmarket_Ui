'use client';
import 'normalize.css';
import './GlobalStyles/GlobalStyles.scss';
import Header from './pages/DefaultLayouts/Header/page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApiProvider } from './Context/ApiContext/ApiContext';
import Notification from './pages/DefaultLayouts/Notification/page';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // Dữ liệu thông báo (có thể lấy từ API hoặc hardcode)

    return (
        <html lang="en">
            <body>
                <ApiProvider>
                    {/* Notifycation */}
                    <>
                        {/* <Notification /> */}
                        <Header />
                    </>
                    <main className="container">{children}</main>
                    <ToastContainer />
                </ApiProvider>
            </body>
        </html>
    );
}
