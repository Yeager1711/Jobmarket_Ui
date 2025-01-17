import React, { useState } from 'react';
import styles from './Region_Details.module.scss';
import  {REGION_MIN_SALARY} from '../../../../OutstandingTool/Details/Criteria/region'

interface RegionDetailsProps {
    onClose: () => void;
}

function Region_Details({ onClose }: RegionDetailsProps) {
    const [isClosing, setIsClosing] = useState(false);

    // Hàm xử lý khi nhấn vào overlay
    const handleOverlayClick = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <div className={styles.Region_Details}>
            <div className={`${styles.overlay}`} onClick={handleOverlayClick}></div>
            <div className={`${styles.content} ${isClosing ? styles.closeAnimation : ''}`}>
                <div className={styles.header__content}>
                    <h3>Mức lương tối thiểu vùng</h3>
                    <p>Áp dụng mức lương tối thiểu vùng mới nhất có hiệu lực từ ngày 01/07/2024</p>
                </div>

                <div className={styles.wrapper__content}>
                    <div className={styles.wrapper_content__text}>
                        <div className={styles.region}>
                          
                            <div className={styles.content}>
                                <span>
                                    <p>Vùng I: {REGION_MIN_SALARY.Region_one.toLocaleString()} đồng/tháng</p>

                                    <p>Vùng II: {REGION_MIN_SALARY.Region_two.toLocaleString()} đồng/tháng</p>

                                    <p>Vùng III: {REGION_MIN_SALARY.Region_three.toLocaleString()} đồng/tháng</p>

                                    <p>Vùng IV: {REGION_MIN_SALARY.Region_four.toLocaleString()} đồng/tháng</p>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.wrapper_content__text}>
                        <div className={styles.region}>
                            <h2>1. Vùng I, gồm các địa bàn:</h2>

                            <div className={styles.content}>
                                <span>
                                    <p>
                                        - Các quận và các huyện Gia Lâm, Đông Anh, Sóc Sơn, Thanh Trì, Thường Tín, Hoài
                                        Đức, Thạch Thất, Quốc Oai, Thanh Oai, Mê Linh, Chương Mỹ và thị xã Sơn Tây thuộc
                                        thành phố Hà Nội;
                                    </p>
                                    <p>
                                        - Các thành phố Hạ Long, Uông Bí, Móng Cái và các thị xã Quảng Yên, Đông Triều
                                        thuộc tỉnh Quảng Ninh;
                                    </p>
                                    <p>
                                        - Các quận và các huyện Thủy Nguyên, An Dương, An Lão, Vĩnh Bảo, Tiên Lãng, Cát
                                        Hải, Kiến Thụy thuộc thành phố Hải Phòng;
                                    </p>
                                    <p>- Thành phố Hải Dương thuộc tỉnh Hải Dương;</p>
                                    <p>
                                        - Các quận, thành phố Thủ Đức và các huyện Củ Chi, Hóc Môn, Bình Chánh, Nhà Bè
                                        thuộc Thành phố Hồ Chí Minh;
                                    </p>
                                    <p>
                                        - Các thành phố Biên Hòa, Long Khánh và các huyện Nhơn Trạch, Long Thành, Vĩnh
                                        Cửu, Trảng Bom, Xuân Lộc, Thống Nhất thuộc tỉnh Đồng Nai;
                                    </p>
                                    <p>
                                        - Các thành phố Thủ Dầu Một, Thuận An, Dĩ An, Tân Uyên, Bến Cát và các huyện Bàu
                                        Bàng, Bắc Tân Uyên, Dầu Tiếng, Phú Giáo thuộc tỉnh Bình Dương;
                                    </p>
                                    <p>- Thành phố Vũng Tàu, thị xã Phú Mỹ thuộc tỉnh Bà Rịa - Vũng Tàu;</p>
                                    <p>
                                        - Thành phố Tân An và các huyện Đức Hòa, Bến Lức, Cần Giuộc thuộc tỉnh Long An.
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.wrapper_content__text}>
                        <div className={styles.region}>
                            <h2>2. Vùng II, gồm các địa bàn:</h2>

                            <div className={styles.content}>
                                <span>
                                    <p>- Các huyện còn lại thuộc thành phố Hà Nội;</p>
                                    <p>- Thành phố Lào Cai thuộc tỉnh Lào Cai;</p>
                                    <p>- Các thành phố Thái Nguyên, Sông Công và Phổ Yên thuộc tỉnh Thái Nguyên;</p>
                                    <p>- Thành phố Hoà Bình và huyện Lương Sơn thuộc tỉnh Hòa Bình;</p>
                                    <p>- Thành phố Việt Trì thuộc tỉnh Phú Thọ;</p>
                                    <p>
                                        - Thành phố Bắc Giang, thị xã Việt Yên và huyện Yên Dũng thuộc tỉnh Bắc Giang;
                                    </p>
                                    <p>
                                        - Các thành phố Vĩnh Yên, Phúc Yên và các huyện Bình Xuyên, Yên Lạc thuộc tỉnh
                                        Vĩnh Phúc;
                                    </p>
                                    <p>
                                        - Các thành phố Bắc Ninh, Từ Sơn; các thị xã Thuận Thành, Quế Võ và các huyện
                                        Tiên Du, Yên Phong, Gia Bình, Lương Tài thuộc tỉnh Bắc Ninh;
                                    </p>
                                    <p>
                                        - Thành phố Hưng Yên, thị xã Mỹ Hào và các huyện Văn Lâm, Văn Giang, Yên Mỹ
                                        thuộc tỉnh Hưng Yên;
                                    </p>
                                    <p>
                                        - Thành phố Chí Linh, thị xã Kinh Môn và các huyện Cẩm Giàng, Bình Giang, Tứ Kỳ,
                                        Gia Lộc, Nam Sách, Kim Thành thuộc tỉnh Hải Dương;
                                    </p>
                                    <p>- Thành phố Cẩm Phả thuộc tỉnh Quảng Ninh;</p>
                                    <p>- Các huyện còn lại thuộc thành phố Hải Phòng;</p>
                                    <p>- Thành phố Thái Bình thuộc tỉnh Thái Bình;</p>
                                    <p>- Thành phố Nam Định và huyện Mỹ Lộc thuộc tỉnh Nam Định;</p>
                                    <p>- Thành phố Ninh Bình thuộc tỉnh Ninh Bình;</p>
                                    <p>
                                        - Các thành phố Thanh Hóa, Sầm Sơn và các thị xã Bỉm Sơn, Nghi Sơn thuộc tỉnh
                                        Thanh Hóa;
                                    </p>
                                    <p>
                                        - Thành phố Vinh, thị xã Cửa Lò và các huyện Nghi Lộc, Hưng Nguyên thuộc tỉnh
                                        Nghệ An;
                                    </p>
                                    <p>- Thành phố Đồng Hới thuộc tỉnh Quảng Bình;</p>
                                    <p>- Thành phố Huế thuộc tỉnh Thừa Thiên Huế;</p>
                                    <p>- Các thành phố Hội An, Tam Kỳ thuộc tỉnh Quảng Nam;</p>
                                    <p>- Các quận, huyện thuộc thành phố Đà Nẵng;</p>
                                    <p>- Các thành phố Nha Trang, Cam Ranh và thị xã Ninh Hòa thuộc tỉnh Khánh Hòa;</p>
                                    <p>- Các thành phố Đà Lạt, Bảo Lộc thuộc tỉnh Lâm Đồng;</p>
                                    <p>- Thành phố Phan Thiết thuộc tỉnh Bình Thuận;</p>
                                    <p>- Huyện Cần Giờ thuộc Thành phố Hồ Chí Minh;</p>
                                    <p>
                                        - Thành phố Tây Ninh, các thị xã Trảng Bàng, Hòa Thành và huyện Gò Dầu thuộc
                                        tỉnh Tây Ninh;
                                    </p>
                                    <p>- Các huyện Định Quán, Tân Phú, Cẩm Mỹ thuộc tỉnh Đồng Nai;</p>
                                    <p>
                                        - Thành phố Đồng Xoài, thị xã Chơn Thành và huyện Đồng Phú thuộc tỉnh Bình
                                        Phước;
                                    </p>
                                    <p>- Thành phố Bà Rịa thuộc tỉnh Bà Rịa - Vũng Tàu;</p>
                                    <p>- Các huyện Thủ Thừa, Cần Đước và thị xã Kiến Tường thuộc tỉnh Long An;</p>
                                    <p>- Thành phố Mỹ Tho và huyện Châu Thành thuộc tỉnh Tiền Giang;</p>
                                    <p>- Thành phố Bến Tre và huyện Châu Thành thuộc tỉnh Bến Tre;</p>
                                    <p>- Thành phố Vĩnh Long và thị xã Bình Minh thuộc tỉnh Vĩnh Long;</p>
                                    <p>- Các quận thuộc thành phố Cần Thơ;</p>
                                    <p>- Các thành phố Rạch Giá, Hà Tiên, Phú Quốc thuộc tỉnh Kiên Giang;</p>
                                    <p>- Các thành phố Long Xuyên, Châu Đốc thuộc tỉnh An Giang;</p>
                                    <p>- Thành phố Trà Vinh thuộc tỉnh Trà Vinh;</p>
                                    <p>- Thành phố Sóc Trăng thuộc tỉnh Sóc Trăng;</p>
                                    <p>- Thành phố Bạc Liêu thuộc tỉnh Bạc Liêu;</p>
                                    <p>- Thành phố Cà Mau thuộc tỉnh Cà Mau.</p>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.wrapper_content__text}>
                        <div className={styles.region}>
                            <h2>3. Vùng III, gồm các địa bàn:</h2>

                            <div className={styles.content}>
                                <span>
                                    <p>
                                        - Các thành phố trực thuộc tỉnh còn lại (trừ các thành phố trực thuộc tỉnh nêu
                                        tại vùng I, vùng II);
                                    </p>
                                    <p>- Thị xã Sa Pa, huyện Bảo Thắng thuộc tỉnh Lào Cai;</p>
                                    <p>- Các huyện Phú Bình, Phú Lương, Đồng Hỷ, Đại Từ thuộc tỉnh Thái Nguyên;</p>
                                    <p>- Các huyện Hiệp Hòa, Tân Yên, Lạng Giang thuộc tỉnh Bắc Giang;</p>
                                    <p>- Các huyện Ninh Giang, Thanh Miện, Thanh Hà thuộc tỉnh Hải Dương;</p>
                                    <p>
                                        - Thị xã Phú Thọ và các huyện Phù Ninh, Lâm Thao, Thanh Ba, Tam Nông thuộc tỉnh
                                        Phú Thọ;
                                    </p>
                                    <p>
                                        - Các huyện Vĩnh Tường, Tam Đảo, Tam Dương, Lập Thạch, Sông Lô thuộc tỉnh Vĩnh
                                        Phúc;
                                    </p>
                                    <p>- Các huyện Vân Đồn, Hải Hà, Đầm Hà, Tiên Yên thuộc tỉnh Quảng Ninh;</p>
                                    <p>- Các huyện còn lại thuộc tỉnh Hưng Yên;</p>
                                    <p>- Các huyện Thái Thụy, Tiền Hải thuộc tỉnh Thái Bình;</p>
                                    <p>- Các huyện còn lại thuộc tỉnh Nam Định;</p>
                                    <p>- Thị xã Duy Tiên và huyện Kim Bảng thuộc tỉnh Hà Nam;</p>
                                    <p>- Các huyện Gia Viễn, Yên Khánh, Hoa Lư thuộc tỉnh Ninh Bình;</p>
                                    <p>
                                        - Các huyện Đông Sơn, Quảng Xương, Triệu Sơn, Thọ Xuân, Yên Định, Vĩnh Lộc,
                                        Thiệu Hóa, Hà Trung, Hậu Lộc, Nga Sơn, Hoằng Hóa, Nông Cống thuộc tỉnh Thanh
                                        Hóa;
                                    </p>
                                    <p>
                                        - Các huyện Quỳnh Lưu, Yên Thành, Diễn Châu, Đô Lương, Nam Đàn, Nghĩa Đàn và các
                                        thị xã Thái Hòa, Hoàng Mai thuộc tỉnh Nghệ An;
                                    </p>
                                    <p>- Thị xã Kỳ Anh thuộc tỉnh Hà Tĩnh;</p>
                                    <p>
                                        - Các thị xã Hương Thủy, Hương Trà và các huyện Phú Lộc, Phong Điền, Quảng Điền,
                                        Phú Vang thuộc tỉnh Thừa Thiên Huế;
                                    </p>
                                    <p>
                                        - Thị xã Điện Bàn và các huyện Đại Lộc, Duy Xuyên, Núi Thành, Quế Sơn, Thăng
                                        Bình, Phú Ninh thuộc tỉnh Quảng Nam;
                                    </p>
                                    <p>- Các huyện Bình Sơn, Sơn Tịnh thuộc tỉnh Quảng Ngãi;</p>
                                    <p>- Các thị xã Sông Cầu, Đông Hòa thuộc tỉnh Phú Yên;</p>
                                    <p>- Các huyện Ninh Hải, Thuận Bắc, Ninh Phước thuộc tỉnh Ninh Thuận;</p>
                                    <p>- Các huyện Cam Lâm, Diên Khánh, Vạn Ninh thuộc tỉnh Khánh Hòa;</p>
                                    <p>- Huyện Đăk Hà thuộc tỉnh Kon Tum;</p>
                                    <p>- Các huyện Đức Trọng, Di Linh thuộc tỉnh Lâm Đồng;</p>
                                    <p>
                                        - Thị xã La Gi và các huyện Hàm Thuận Bắc, Hàm Thuận Nam thuộc tỉnh Bình Thuận;
                                    </p>
                                    <p>
                                        - Các thị xã Phước Long, Bình Long và các huyện Hớn Quản, Lộc Ninh, Phú Riềng
                                        thuộc tỉnh Bình Phước;
                                    </p>
                                    <p>- Các huyện còn lại thuộc tỉnh Tây Ninh;</p>
                                    <p>
                                        - Các huyện Long Điền, Đất Đỏ, Xuyên Mộc, Châu Đức, Côn Đảo thuộc tỉnh Bà Rịa -
                                        Vũng Tàu;
                                    </p>
                                    <p>- Các huyện Đức Huệ, Châu Thành, Tân Trụ, Thạnh Hóa thuộc tỉnh Long An;</p>
                                    <p>- Thị xã Cai Lậy và các huyện Chợ Gạo, Tân Phước thuộc tỉnh Tiền Giang;</p>
                                    <p>- Các huyện Ba Tri, Bình Đại, Mỏ Cày Nam thuộc tỉnh Bến Tre;</p>
                                    <p>- Các huyện Mang Thít, Long Hồ thuộc tỉnh Vĩnh Long;</p>
                                    <p>- Các huyện thuộc thành phố Cần Thơ;</p>
                                    <p>- Các huyện Kiên Lương, Kiên Hải, Châu Thành thuộc tỉnh Kiên Giang;</p>
                                    <p>
                                        - Thị xã Tân Châu và các huyện Châu Phú, Châu Thành, Thoại Sơn thuộc tỉnh An
                                        Giang;
                                    </p>
                                    <p>- Các huyện Châu Thành, Châu Thành A thuộc tỉnh Hậu Giang;</p>
                                    <p>- Thị xã Duyên Hải thuộc tỉnh Trà Vinh;</p>
                                    <p>- Thị xã Giá Rai và huyện Hòa Bình thuộc tỉnh Bạc Liêu;</p>
                                    <p>- Các thị xã Vĩnh Châu, Ngã Năm thuộc tỉnh Sóc Trăng;</p>
                                    <p>- Các huyện Năm Căn, Cái Nước, U Minh, Trần Văn Thời thuộc tỉnh Cà Mau;</p>
                                    <p>
                                        - Các huyện Lệ Thủy, Quảng Ninh, Bố Trạch, Quảng Trạch và thị xã Ba Đồn thuộc
                                        tỉnh Quảng Bình.
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.wrapper_content__text}>
                        <div className={styles.region}>
                            <h2>4. Vùng IV, gồm các địa bàn còn lại</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Region_Details;
