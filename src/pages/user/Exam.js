import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
// import banner from "../../assets/banner1.jpg";
import banner3 from "../../assets/banner3.jpg";
import Advisory from "../../components/features/Advisory/Advisory";
import Exam from "../../components/features/Exam/Exam";
// import SideFilter from "../../components/features/SideFilter/SideFilter";
import { useSelector } from "react-redux";
import { fetchUserExams } from "../../redux/slices/examSlice";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserCategories } from "../../redux/slices/categorySlice";
import useFetchData from "../../hooks/useFetchData";
const UserExam = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const currentCategory = category ?? "default";
    const examsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    // console.log(currentCategory);
    // Fetch user categories
    const { userCategories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.categories);
    console.log(categoriesLoading, categoriesError);
    useFetchData(fetchUserCategories);
    console.log(userCategories);
    const [filter, setFilter] = useState([]);
    console.log(filter);
    // Fetch user exams
    const { userExams, totalUser, loading: examsLoading, error: examsError } = useSelector((state) => state.exams);
    console.log(examsLoading, examsError);
    useFetchData(() => fetchUserExams({ page: currentPage, limit: examsPerPage, filters: filter }), [filter, currentPage]);
    console.log(userExams);
    useEffect(() => {
        const categoryExists = userCategories.some((cat) => cat.value.some(item => item.value === currentCategory));
        setFilter((prevFilter) => {
            // Lọc các bộ lọc không phải "Danh mục"
            const nonCategoryFilters = prevFilter.filter((filter) => filter.type !== "Danh mục");
            // Tạo bộ lọc "Danh mục" mới (nếu hợp lệ)
            const categoryFilter = categoryExists
                ? [{ type: "Danh mục", value: [currentCategory] }]
                : [];
            // Kết hợp các bộ lọc
            return [...categoryFilter, ...nonCategoryFilters];
        });
    }, [currentCategory, userCategories]);
    // useEffect(() => {
    //   const filteredExams = userExams.filter((exam) =>
    //     userCategories.every((category) => {
    //       // Get filters relevant to the current category
    //       const relevantFilters = filter.filter((f) => f.type === category.option);
    //       // If no filters for this category, accept this category without filtering
    //       if (relevantFilters.length === 0) return true;
    //       // Otherwise, check if at least one filter matches the exam's tags
    //       return relevantFilters.some((f) =>
    //         exam.categories.some((tag) => tag.type === f.type && tag.value.includes(f.value))
    //       );
    //     })
    //   );
    //   setExamsFilter(filteredExams);
    // }, [filter, userCategories, userExams]);
    const changeFilter = (type, value, checked) => {
        setFilter((prevFilter) => {
            // Kiểm tra xem loại filter đã tồn tại trong filter chưa
            const existingFilter = prevFilter.find((filter) => filter.type === type);
            if (checked) {
                if (existingFilter) {
                    // Nếu filter tồn tại rồi, kiểm tra value đã có trong values chưa
                    if (!existingFilter.value.includes(value)) {
                        // Nếu chưa có, thêm value vào values
                        return prevFilter.map((filter) => filter.type === type
                            ? { ...filter, value: [...filter.value, value] }
                            : filter);
                    }
                    // Nếu value đã tồn tại, không làm gì
                    return prevFilter;
                }
                else {
                    // Nếu filter chưa tồn tại, tạo mới với mảng values chứa giá trị
                    return [...prevFilter, { type, value: [value] }];
                }
            }
            else {
                if (existingFilter) {
                    // Nếu filter tồn tại và bỏ chọn, xóa giá trị khỏi mảng values
                    const updatedFilter = {
                        ...existingFilter,
                        value: existingFilter.value.filter((v) => v !== value),
                    };
                    // Nếu mảng value rỗng sau khi xóa, xóa filter khỏi mảng
                    if (updatedFilter.value.length === 0) {
                        return prevFilter.filter((filter) => filter.type !== type);
                    }
                    // Nếu mảng value không rỗng, cập nhật filter
                    return prevFilter.map((filter) => filter.type === type ? updatedFilter : filter);
                }
                else {
                    return prevFilter;
                }
            }
        });
    };
    const isChecked = (type, value) => {
        return filter.some((f) => f.type === type && f.value.includes(value));
    };
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    // Calculate indices for the exams to display
    // const indexOfLastExam = currentPage * examsPerPage;
    // const indexOfFirstExam = indexOfLastExam - examsPerPage;
    // const currentExams = examsFilter.slice(indexOfFirstExam, indexOfLastExam);
    // Calculate total pages
    const totalPages = Math.ceil(totalUser / examsPerPage);
    // Ref for scrolling
    const examListRef = useRef(null);
    const scrollToExams = () => {
        if (examListRef.current) {
            const offset = 100; // Desired offset from the top
            const topPosition = examListRef.current.getBoundingClientRect().top + window.pageYOffset;
            // Scroll smoothly to the correct position
            window.scrollTo({ top: topPosition - offset, behavior: "smooth" });
        }
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
        scrollToExams(); // Scroll whenever page changes
    };
    return (_jsxs("div", { children: [_jsx("div", { className: "w-full mt-14", children: _jsx("div", { className: "max-w-[1228px] mx-auto", children: _jsx("img", { src: banner3, alt: "alt" }) }) }), _jsxs("div", { className: "max-w-[1228px] mx-auto mt-20 text-[#00095B] pb-20", children: [_jsx("p", { className: "text-4xl mb-2", children: "\u0110\u1EC1 thi online" }), _jsx("p", { className: "text-base", children: "Ph\u1EA7n m\u1EC1m v\u00E0 ch\u01B0\u01A1ng tr\u00ECnh h\u1ECDc online ch\u1EA5t l\u01B0\u1EE3ng cao c\u1EE7a STUDY4 \u0111\u01B0\u1EE3c thi\u1EBFt k\u1EBF theo ch\u01B0\u01A1ng tr\u00ECnh ti\u1EBFng Anh chu\u1EA9n CEFR (A1 -C2) c\u1EE7a \u0111\u1EA1i h\u1ECDc Cambridge v\u00E0 Oxford (Anh) v\u1EDBi h\u1EC7 th\u1ED1ng b\u00E0i gi\u1EA3ng, b\u00E0i t\u1EADp phong ph\u00FA \u0111a d\u1EA1ng. B\u1EA1n c\u00F3 th\u1EC3 h\u1ECDc th\u1EED mi\u1EC5n ph\u00ED tr\u01B0\u1EDBc khi \u0111\u1EB7t mua s\u1EA3n ph\u1EA9m." }), _jsxs("div", { className: "flex pt-14", children: [_jsxs("div", { className: "w-full max-w-[20%] lg:w-1/3 px-4 rounded-lg sticky top-[80px] h-max", children: [userCategories?.map((category, categoryId) => (category.option === "Danh mục"
                                        ? _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-bold text-lg mb-2", children: "T\u1EA5t C\u1EA3 Danh M\u1EE5c" }), _jsxs("ul", { className: "space-y-2 text-sm text-gray-700", children: [category?.value?.map((value, index) => (value.value === currentCategory ?
                                                            _jsx("li", { className: "text-red-500 font-medium cursor-pointer", children: value.value }, index)
                                                            :
                                                                _jsx("li", { className: "hover:text-blue-500 font-medium cursor-pointer", onClick: () => navigate(`/exams/${value.value}`), children: value.value }, index))), showMoreCategories && (_jsx("li", { className: "hover:text-blue-500 cursor-pointer", children: "Danh M\u1EE5c Kh\u00E1c" })), _jsx("li", { className: "text-blue-500 cursor-pointer", onClick: () => setShowMoreCategories(!showMoreCategories), children: showMoreCategories ? "Thu gọn" : "Thêm" })] })] }, categoryId)
                                        : "")), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-bold text-lg mb-2", children: "B\u1ED9 L\u1ECDc T\u00ECm Ki\u1EBFm" }), userCategories?.map((category, categoryId) => (category.option === "Danh mục"
                                                ? ""
                                                : _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: category?.option }), _jsxs("ul", { className: "space-y-2 text-sm text-gray-700", children: [category?.value?.map((value, i) => (_jsx("li", { children: _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: "mr-2", checked: isChecked(category.option, value.value), onChange: (e) => changeFilter(category.option, value.value, e.target.checked) }), value.value] }) }, i))), showMoreFilters && (_jsx("li", { children: _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: "mr-2" }), "\u0110\u1EC1 si\u00EAu kh\u00F3"] }) }))] }), _jsx("p", { className: "text-blue-500 cursor-pointer mt-2 text-sm", onClick: () => setShowMoreFilters(!showMoreFilters), children: showMoreFilters ? "Thu gọn" : "Thêm" })] }, categoryId)))] })] }), _jsxs("div", { className: "max-w-[80%] w-full flex flex-col mt-2 mb-8", children: [_jsx("div", { className: "grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 mx-3  flex-grow", ref: examListRef, children: userExams.map((exam) => (_jsx("div", { children: _jsx(Exam, { _id: exam._id, name: exam.name, image: exam.image, price: Number(exam.price), discount: Number(exam.discount), time: 15, rating: 4.8, rates: 123, problems: 15, users: 234 }) }, exam._id))) }), _jsxs("div", { className: "flex justify-center items-center mt-8", children: [_jsx("button", { className: `px-4 py-2 mx-1 ${currentPage === 1
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-blue-500 text-white hover:bg-blue-600"} rounded`, disabled: currentPage === 1, onClick: () => {
                                                    if (currentPage > 1)
                                                        handlePageChange(currentPage - 1);
                                                }, children: "Previous" }), Array.from({ length: totalPages }, (_, index) => (_jsx("button", { className: `px-4 py-2 mx-1 ${currentPage === index + 1
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-200 hover:bg-blue-500 hover:text-white"} rounded`, onClick: () => handlePageChange(index + 1), children: index + 1 }, index + 1))), _jsx("button", { className: `px-4 py-2 mx-1 ${currentPage === totalPages
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-blue-500 text-white hover:bg-blue-600"} rounded`, disabled: currentPage === totalPages, onClick: () => handlePageChange(currentPage + 1), children: "Next" })] })] })] })] }), _jsx(Advisory, {})] }));
};
export default UserExam;
