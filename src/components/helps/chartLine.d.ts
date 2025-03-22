import React from "react";
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
declare const SalesChart: React.FC<ChartProps>;
export default SalesChart;
