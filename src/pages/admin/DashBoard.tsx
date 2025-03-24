import React, { useState, useEffect, useRef } from "react";

import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import { IoCartOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import { TbChartInfographic } from "react-icons/tb";

import Table from "../../components/table";
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
  const [firstHeight, setFirstHeight] = useState<number>(0);
  const firstDivRef = useRef<HTMLDivElement>(null);

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
        position: "top" as const,
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
        position: "top" as const,
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
  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <div className="w-full h-full bg-white">
          <div style={{ height: `calc(100% - 8px)` }} className="m-2">
            <div
              ref={firstDivRef}
              className="flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
              <div className="left uppercase">
                <h2 className="font-size-20">DashBoard</h2>
              </div>
              <div className="right uppercase"></div>
            </div>

            {/* Doanh thu */}
            <div className="flex flex-wrap justify-center gap-4 my-3">
              <div className="w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div>
                  <p className="text-[20px]">100.000.000đ</p>
                  <p className="text-xs">Tổng lợi nhuận</p>
                  <div className="flex items-center text-[rgb(6,165,97)]">
                    12%
                    <FaArrowTrendUp className="ml-1 text-green-600" />
                  </div>
                </div>
                <div className="bg-[#ECF2FF] rounded-full p-2">
                  <MdAttachMoney className="text-color-secondary" />
                </div>
              </div>
              <div className="w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div className="left">
                  <p className="text-[20px]">1.056</p>
                  <p style={{ fontSize: "12px" }}>Mua khoá học</p>
                  <div className="flex items-center text-[rgb(6,165,97)]">
                    15,34%
                    <FaArrowTrendUp
                      style={{ color: "#06A561", marginLeft: "4px" }}
                    />
                  </div>
                </div>
                <div className="right">
                  <div className="bg-[#ECF2FF] rounded-full p-2">
                    <IoCartOutline className="text-color-secondary" />
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div className="left">
                  <p className="text-[20px]">1.567</p>
                  <p style={{ fontSize: "12px" }}>Mua đề thi</p>
                  <div className="flex items-center text-[rgb(6,165,97)]">
                    12,6%
                    <FaArrowTrendUp
                      style={{ color: "#06A561", marginLeft: "4px" }}
                    />
                  </div>
                </div>
                <div className="right">
                  <div className="bg-[#ECF2FF] rounded-full p-2">
                    <IoCartOutline className="text-color-secondary" />
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div className="left">
                  <p className="text-[20px]">201</p>
                  <p style={{ fontSize: "12px" }}>Người quay lại</p>
                  <div className="flex items-center text-[#ff0000]">
                    8%
                    <FaArrowTrendDown
                      style={{ color: "#ff0000", marginLeft: "4px" }}
                    />
                  </div>
                </div>
                <div className="right">
                  <div className="bg-[#ECF2FF] rounded-full p-2">
                    <TbChartInfographic className="text-red-500" />
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-[45%] lg:w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div className="left">
                  <p className="text-[20px]">9.678</p>
                  <p style={{ fontSize: "12px" }}>Tổng người dùng</p>
                  <div className="flex items-center text-[rgb(6,165,97)]">
                    19%
                    <FaArrowTrendUp
                      style={{ color: "#06A561", marginLeft: "4px" }}
                    />
                  </div>
                </div>
                <div className="right">
                  <div className="bg-[#ECF2FF] rounded-full p-2">
                    <TbChartInfographic className="text-color-secondary" />
                  </div>
                </div>
              </div>

              {/* Repeat similar blocks for other cards */}
            </div>

            {/* Thống kê */}
            <div className="flex flex-col md:flex-row gap-4 my-3">
              <div className="w-full md:w-[55%] bg-white p-2 rounded-lg">
                <div className="flex justify-between px-3">
                  <h2 className="font-semibold">Đồ thị overtime</h2>
                  <div className="flex items-center text-xs">
                    12 tháng gần nhất
                    <IoIosArrowDown className="ml-1" />
                  </div>
                </div>
                <SalesChart data={dataLine} options={optionsLine} />
              </div>

              <div className="w-full md:w-[35%] bg-white p-2 rounded-lg">
                <h2 className="text-center">Đồ thị 7 ngày gần nhất</h2>
                <ChartCol data={dataCol} options={optionsCol} />
              </div>
            </div>

            {/* Table */}
            {/* <div className="flex flex-col lg:flex-row gap-4 my-3 justify-around">
              <div className="w-full lg:w-[49%] h-[400px] bg-white rounded-lg overflow-auto">
                <h2 className="px-5 py-4 text-[rgba(30,39,83,1)]">
                  Những khoá học bán chạy
                </h2>
                <Table columns={columnsCourse} data={dataCourse} />
              </div>
              <div className="w-full lg:w-[49%] h-[400px] bg-white rounded-lg overflow-auto">
                <h2 className="px-5 py-4 text-[rgba(30,39,83,1)]">
                  Những đề thi bán chạy
                </h2>
                <Table columns={columnsExam} data={dataExam} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
