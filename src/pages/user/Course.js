import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCourses } from "../../redux/slices/courseSlice";
// import banner from '../../assets/banner1.jpg';
import banner3 from "../../assets/banner3.jpg";
import Course from "../../components/features/Course/Course";
import Advisory from "../../components/features/Advisory/Advisory";
const UserCourse = () => {
    const dispatch = useDispatch();
    const { userCourses, loading, error } = useSelector((state) => state.courses);
    useEffect(() => {
        dispatch(fetchUserCourses({ page: 1, limit: 100 }));
    }, [dispatch]);
    return loading ? ("Waiting for Loading") : error ? ("Something have wrong") : (_jsxs("div", { children: [_jsx("div", { className: "w-full mt-14", children: _jsx("div", { className: "max-w-[1228px] mx-auto", children: _jsx("img", { src: banner3, alt: "alt" }) }) }), _jsxs("div", { className: "max-w-[1228px] mx-auto mt-20 text-[#00095B] pb-20", children: [_jsx("p", { className: "text-4xl mb-2", children: "Ch\u01B0\u01A1ng tr\u00ECnh h\u1ECDc online" }), _jsx("p", { className: "text-base", children: "Ph\u1EA7n m\u1EC1m v\u00E0 ch\u01B0\u01A1ng tr\u00ECnh h\u1ECDc online ch\u1EA5t l\u01B0\u1EE3ng cao c\u1EE7a STUDY4 \u0111\u01B0\u1EE3c thi\u1EBFt k\u1EBF theo ch\u01B0\u01A1ng tr\u00ECnh ti\u1EBFng Anh chu\u1EA9n CEFR (A1 -C2) c\u1EE7a \u0111\u1EA1i h\u1ECDc Cambridge v\u00E0 Oxford (Anh) v\u1EDBi h\u1EC7 th\u1ED1ng b\u00E0i gi\u1EA3ng, b\u00E0i t\u1EADp phong ph\u00FA \u0111a d\u1EA1ng. B\u1EA1n c\u00F3 th\u1EC3 h\u1ECDc th\u1EED mi\u1EC5n ph\u00ED tr\u01B0\u1EDBc khi \u0111\u1EB7t mua s\u1EA3n ph\u1EA9m." }), _jsxs("div", { className: "pt-14", children: [_jsx("p", { className: "text-3xl font-bold pb-5", children: "L\u1EDBp c\u01A1 b\u1EA3n:" }), _jsx("div", { className: "grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3", children: userCourses?.map((course) => (_jsx("div", { children: _jsx(Course, { id: course._id, name: course.name, image: course.image, price: Number(course.price), discount: Number(course.discount), description: "7 chủ đề - 39 bài học - 67 bài tập", rating: 5 }) }, course._id))) })] })] }), _jsx(Advisory, {})] }));
};
export default UserCourse;
