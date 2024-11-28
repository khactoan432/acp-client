import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[]; // Ngày hiển thị trên trục x
    datasets: {
      label: string;
      data: number[]; // Dữ liệu trên trục y
      backgroundColor: string;
    }[];
  };
  options?: any;
}

const ChartCol: React.FC<BarChartProps> = ({ data, options }) => {
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartCol;
