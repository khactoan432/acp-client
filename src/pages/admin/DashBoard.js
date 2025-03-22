import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import { IoCartOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import { TbChartInfographic } from "react-icons/tb";
import SalesChart from "../../components/helps/chartLine";
import ChartCol from "../../components/helps/chartCol";
import imageCourse from "../../assets/admin/ImageCourse.png";
const AdminDashboard = () => {
    const header = localStorage.getItem("access_token");
    const [screenHeight, setScreenHeight] = useState(window.innerHeight - 56);
    const updateScreenHeight = () => {
        setScreenHeight(window.innerHeight - 56);
    };
    useEffect(() => {
        window.addEventListener("resize", updateScreenHeight);
        return () => {
            window.removeEventListener("resize", updateScreenHeight);
        };
    }, []);
    const [firstHeight, setFirstHeight] = useState(0);
    const firstDivRef = useRef(null);
    useEffect(() => {
        if (firstDivRef.current) {
            setFirstHeight(firstDivRef.current.offsetHeight);
        }
    }, []);
    // fake data chart col
    const dataCol = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // 7 ngày gần nhất
        datasets: [
            {
                label: "Courses Sold",
                data: [30, 45, 60, 50, 80, 70, 90], // Số liệu khóa học
                backgroundColor: "rgba(30, 39, 83, 1)", // Màu cột khóa học
            },
            {
                label: "Exams Sold",
                data: [20, 35, 50, 40, 70, 60, 80], // Số liệu đề thi
                backgroundColor: "rgba(31, 210, 134, 1)", // Màu cột đề thi
            },
        ],
    };
    // Tùy chọn cho biểu đồ
    const optionsCol = {
        responsive: true,
        maintainAspectRatio: false, // Để chiều cao cố định theo container
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Weekly Sales of Courses and Exams",
            },
        },
        scales: {
            y: {
                min: 0,
                ticks: {
                    stepSize: 20, // Tăng mỗi 20 trên trục y
                },
            },
        },
    };
    //fake data chart line
    const dataLine = {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        datasets: [
            {
                label: "Courses Sold",
                data: [30, 40, 50, 70, 60, 80, 90, 100, 80, 70, 50, 30],
                borderColor: "rgba(30, 39, 83, 1)",
                backgroundColor: "rgba(30, 39, 83, 0.2)",
                tension: 0.4,
            },
            {
                label: "Exams Sold",
                data: [20, 35, 40, 60, 50, 70, 85, 90, 70, 60, 40, 20],
                borderColor: "rgba(31, 210, 134, 1)",
                backgroundColor: "rgba(31, 210, 134, 0.2)",
                tension: 0.4,
            },
        ],
    };
    const optionsLine = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Monthly Sales for Courses and Exams",
            },
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                },
            },
        },
    };
    // Khoá học đã bán
    const columnsCourse = ["Name", "Price", "Units Sold"];
    const dataCourse = [
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$10",
            "Units Sold": 100,
        },
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$20",
            "Units Sold": 50,
        },
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$15",
            "Units Sold": 75,
        },
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$15",
            "Units Sold": 75,
        },
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$15",
            "Units Sold": 75,
        },
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$15",
            "Units Sold": 75,
        },
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$15",
            "Units Sold": 75,
        },
    ];
    // đề thi đã bán
    const columnsExam = ["Name", "Price", "Units Sold"];
    const dataExam = [
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$10",
            "Units Sold": 100,
        },
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$20",
            "Units Sold": 50,
        },
        {
            Name: { image: imageCourse, text: "[ACP General training]" },
            Price: "$15",
            "Units Sold": 75,
        },
    ];
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsx("div", { className: "w-full h-full bg-white", children: _jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2", children: [_jsxs("div", { ref: firstDivRef, className: "flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "DashBoard" }) }), _jsx("div", { className: "right uppercase" })] }), _jsxs("div", { className: "flex flex-wrap justify-center gap-4 my-3", children: [_jsxs("div", { className: "w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[20px]", children: "100.000.000\u0111" }), _jsx("p", { className: "text-xs", children: "T\u1ED5ng l\u1EE3i nhu\u1EADn" }), _jsxs("div", { className: "flex items-center text-[rgb(6,165,97)]", children: ["12%", _jsx(FaArrowTrendUp, { className: "ml-1 text-green-600" })] })] }), _jsx("div", { className: "bg-[#ECF2FF] rounded-full p-2", children: _jsx(MdAttachMoney, { className: "text-color-secondary" }) })] }), _jsxs("div", { className: "w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around", children: [_jsxs("div", { className: "left", children: [_jsx("p", { className: "text-[20px]", children: "1.056" }), _jsx("p", { style: { fontSize: "12px" }, children: "Mua kho\u00E1 h\u1ECDc" }), _jsxs("div", { className: "flex items-center text-[rgb(6,165,97)]", children: ["15,34%", _jsx(FaArrowTrendUp, { style: { color: "#06A561", marginLeft: "4px" } })] })] }), _jsx("div", { className: "right", children: _jsx("div", { className: "bg-[#ECF2FF] rounded-full p-2", children: _jsx(IoCartOutline, { className: "text-color-secondary" }) }) })] }), _jsxs("div", { className: "w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around", children: [_jsxs("div", { className: "left", children: [_jsx("p", { className: "text-[20px]", children: "1.567" }), _jsx("p", { style: { fontSize: "12px" }, children: "Mua \u0111\u1EC1 thi" }), _jsxs("div", { className: "flex items-center text-[rgb(6,165,97)]", children: ["12,6%", _jsx(FaArrowTrendUp, { style: { color: "#06A561", marginLeft: "4px" } })] })] }), _jsx("div", { className: "right", children: _jsx("div", { className: "bg-[#ECF2FF] rounded-full p-2", children: _jsx(IoCartOutline, { className: "text-color-secondary" }) }) })] }), _jsxs("div", { className: "w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around", children: [_jsxs("div", { className: "left", children: [_jsx("p", { className: "text-[20px]", children: "201" }), _jsx("p", { style: { fontSize: "12px" }, children: "Ng\u01B0\u1EDDi quay l\u1EA1i" }), _jsxs("div", { className: "flex items-center text-[#ff0000]", children: ["8%", _jsx(FaArrowTrendDown, { style: { color: "#ff0000", marginLeft: "4px" } })] })] }), _jsx("div", { className: "right", children: _jsx("div", { className: "bg-[#ECF2FF] rounded-full p-2", children: _jsx(TbChartInfographic, { className: "text-red-500" }) }) })] }), _jsxs("div", { className: "w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around", children: [_jsxs("div", { className: "left", children: [_jsx("p", { className: "text-[20px]", children: "9.678" }), _jsx("p", { style: { fontSize: "12px" }, children: "T\u1ED5ng ng\u01B0\u1EDDi d\u00F9ng" }), _jsxs("div", { className: "flex items-center text-[rgb(6,165,97)]", children: ["19%", _jsx(FaArrowTrendUp, { style: { color: "#06A561", marginLeft: "4px" } })] })] }), _jsx("div", { className: "right", children: _jsx("div", { className: "bg-[#ECF2FF] rounded-full p-2", children: _jsx(TbChartInfographic, { className: "text-color-secondary" }) }) })] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 my-3", children: [_jsxs("div", { className: "w-full md:w-[55%] bg-white p-2 rounded-lg", children: [_jsxs("div", { className: "flex justify-between px-3", children: [_jsx("h2", { className: "font-semibold", children: "\u0110\u1ED3 th\u1ECB overtime" }), _jsxs("div", { className: "flex items-center text-xs", children: ["12 th\u00E1ng g\u1EA7n nh\u1EA5t", _jsx(IoIosArrowDown, { className: "ml-1" })] })] }), _jsx(SalesChart, { data: dataLine, options: optionsLine })] }), _jsxs("div", { className: "w-full md:w-[35%] bg-white p-2 rounded-lg", children: [_jsx("h2", { className: "text-center", children: "\u0110\u1ED3 th\u1ECB 7 ng\u00E0y g\u1EA7n nh\u1EA5t" }), _jsx(ChartCol, { data: dataCol, options: optionsCol })] })] })] }) })] })] }));
};
export default AdminDashboard;
