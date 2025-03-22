import { jsx as _jsx } from "react/jsx-runtime";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from "chart.js";
// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const SalesChart = ({ data, options }) => {
    const chartOptions = {
        ...options,
        responsive: true,
        maintainAspectRatio: false, // Vô hiệu hóa tỷ lệ mặc định
    };
    return (_jsx("div", { style: {
            width: "100%",
            height: "300px",
            background: "white",
            borderRadius: "8px",
            padding: "12px",
        }, children: _jsx(Line, { data: data, options: chartOptions }) }));
};
export default SalesChart;
