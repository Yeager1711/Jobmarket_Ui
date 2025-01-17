export const formatSalary = (salary) => {
    // Kiểm tra nếu chuỗi chứa "VND"
    if (salary.includes('VND')) {
        // Kiểm tra nếu chuỗi có từ "to" (với VND)
        if (salary.includes('to')) {
            const parts = salary.split('to').map((part) => 
                part
                    .trim()
                    .replace('VND', '')
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // Thêm dấu phân cách hàng nghìn
                    .replace(/(\d)(?=(\d{6})+(?!\d))/g, '$1tr') // Thêm "tr" cho triệu
            );
            return parts.join(' - ');
        }
        // Nếu chỉ có 1 số, bỏ 'VND' và chuyển sang 'tr'
        const amount = salary.replace('VND', '').trim().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').replace(/(\d)(?=(\d{6})+(?!\d))/g, '$1tr');
        return amount;
    }

    // Kiểm tra nếu chuỗi chứa "Up to" và chuyển thành "Lên đến"
    if (salary.startsWith('Up to')) {
        const amount = salary.replace('Up to', '').trim();
        return `Lên đến ${amount.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').replace(/(\d)(?=(\d{6})+(?!\d))/g, '$1tr')}`;
    }

    // Kiểm tra nếu chuỗi chứa "to" hoặc "-" (hoặc dấu "–") và thay thế bằng "-"
    if (salary.includes('to') || salary.includes('-') || salary.includes('–')) {
        const parts = salary.split(/to|-|–/).map((part) => 
            part
                .trim()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // Thêm dấu phân cách hàng nghìn
                .replace(/(\d)(?=(\d{6})+(?!\d))/g, '$1tr') // Thêm "tr" cho triệu
        );
        return parts.join(' - ');
    }

    // Nếu không phải VND hoặc các trường hợp trên, giữ nguyên chuỗi
    return salary;
};
