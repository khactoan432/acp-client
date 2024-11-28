import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension?: number;
    }[];
  };
  options?: any;
}

const SalesChart: React.FC<ChartProps> = ({ data, options }) => {
  const chartOptions = {
    ...options,
    responsive: true,
    maintainAspectRatio: false, // Vô hiệu hóa tỷ lệ mặc định
  };
  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        background: "white",
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      <Line data={data} options={chartOptions} />
    </div>
  );
};

export default SalesChart;
