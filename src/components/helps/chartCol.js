import { jsx as _jsx } from "react/jsx-runtime";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";
// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const ChartCol = ({ data, options }) => {
    return (_jsx("div", { style: { width: "100%", height: "300px" }, children: _jsx(Bar, { data: data, options: options }) }));
};
export default ChartCol;
