import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Exams.tsx
import { useEffect } from "react";
import Exam from "./Exam"; // Import the Exam component
import { useDispatch, useSelector } from "react-redux";
import { fetchUserExams } from "../../../redux/slices/examSlice";
const Exams = () => {
    const dispatch = useDispatch();
    const { userExams, loading, error } = useSelector((state) => state.exams);
    console.log(loading, error);
    useEffect(() => {
        dispatch(fetchUserExams({ page: 1, limit: 4, filters: [] }));
    }, [dispatch]);
    console.log(userExams);
    // const exams = [
    //   {
    //     id: 1,
    //     name: "React for Beginners 1",
    //     time: 20,
    //     image: banner,
    //     price: 79000,
    //     rating: 4.6,
    //     rates: 125,
    //     problems: 8,
    //     users: 232,
    //   },
    //   {
    //     id: 2,
    //     name: "Advanced JavaScript 1",
    //     time: 30,
    //     image: banner,
    //     price: 99000,
    //     rating: 5.0,
    //     rates: 25,
    //     problems: 10,
    //     users: 202,
    //   },
    //   {
    //     id: 3,
    //     name: "React for Beginners 2",
    //     time: 20,
    //     image: banner,
    //     price: 79000,
    //     rating: 4.6,
    //     rates: 74,
    //     problems: 8,
    //     users: 122,
    //   },
    //   {
    //     id: 4,
    //     name: "Advanced JavaScript 2",
    //     time: 30,
    //     image: banner,
    //     price: 99000,
    //     rating: 5.0,
    //     rates: 185,
    //     problems: 10,
    //     users: 292,
    //   },
    //   {
    //     id: 5,
    //     name: "React for Beginners 2",
    //     time: 20,
    //     image: banner,
    //     price: 79000,
    //     rating: 4.6,
    //     rates: 105,
    //     problems: 8,
    //     users: 222,
    //   },
    //   {
    //     id: 6,
    //     name: "Advanced JavaScript 2",
    //     time: 30,
    //     image: banner,
    //     price: 99000,
    //     rating: 5.0,
    //     rates: 23,
    //     problems: 10,
    //     users: 79,
    //   },
    //   {
    //     id: 7,
    //     name: "Advanced JavaScript 2",
    //     time: 30,
    //     image: banner,
    //     price: 99000,
    //     rating: 5.0,
    //     rates: 23,
    //     problems: 10,
    //     users: 79,
    //   },
    //   // Add more exams as needed
    // ];
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 mt-12", children: [_jsx("h2", { className: "text-4xl text-[#00095B] mb-14 text-center", children: "\u0110\u1EC1 thi m\u1EDBi nh\u1EA5t" }), _jsx("div", { className: "grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-4", children: userExams.map((exam) => (_jsx("div", { children: _jsx(Exam, { _id: exam._id, name: exam.name, image: exam.image, price: Number(exam.price), discount: Number(exam.discount), time: 15, rating: 4.8, rates: 46, problems: 12, users: 122 }) }, exam._id))) })] }));
};
export default Exams;
