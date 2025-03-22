import React from "react";
interface BarChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
        }[];
    };
    options?: any;
}
declare const ChartCol: React.FC<BarChartProps>;
export default ChartCol;
