import React from "react";
interface ExamProps {
    _id: string;
    name: string;
    image: string;
    price: number;
    discount: number;
    time: number;
    rating: number;
    rates: number;
    problems: number;
    users: number;
}
declare const Exam: React.FC<ExamProps>;
export default Exam;
