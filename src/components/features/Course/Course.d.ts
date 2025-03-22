import React from "react";
interface CourseProps {
    id: string;
    name: string;
    image: string;
    price: number;
    discount: number;
    description: string;
    rating: number;
}
declare const Course: React.FC<CourseProps>;
export default Course;
