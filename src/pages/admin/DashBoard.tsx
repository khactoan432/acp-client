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
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        {/* content */}
        <div className="w-full h-full overflow-y-hidden">
          <div className="px-5 w-full h-full bg-[rgba(255,246,244,1)] overflow-y-hidden">
            <div className="text-2xl font-semibold my-3">
              <h2>DashBoard</h2>
            </div>
            {/* Doanh thu */}
            <div className="flex justify-around justify-center my-3">
              <div className="min-w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div className="left">
                  <p className="text-[20px] font-semibold">100.000.000đ</p>
                  <p style={{ fontSize: "12px" }}>Tổng lợi nhuận</p>
                  <div className="flex items-center text-[rgb(6,165,97)]">
                    12%
                    <FaArrowTrendUp
                      style={{ color: "#06A561", marginLeft: "4px" }}
                    />
                  </div>
                </div>
                <div className="right">
                  <div className="bg-[#ECF2FF] rounded-full p-2">
                    <MdAttachMoney className="primary-color-text" />
                  </div>
                </div>
              </div>
              <div className="min-w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div className="left">
                  <p className="text-[20px] font-semibold">1.056</p>
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
                    <IoCartOutline className="primary-color-text" />
                  </div>
                </div>
              </div>
              <div className="min-w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div className="left">
                  <p className="text-[20px] font-semibold">1.567</p>
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
                    <IoCartOutline className="primary-color-text" />
                  </div>
                </div>
              </div>
              <div className="min-w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div className="left">
                  <p className="text-[20px] font-semibold">201</p>
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
              <div className="min-w-[208px] bg-white rounded-lg flex p-2 items-center justify-around">
                <div className="left">
                  <p className="text-[20px] font-semibold">9.678</p>
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
                    <TbChartInfographic className="primary-color-text" />
                  </div>
                </div>
              </div>
            </div>
            {/* Thong ke */}
            <div className="flex justify-around my-3">
              <div className="w-[55%] bg-white p-2 rounded-lg">
                <div className="flex justify-between px-3">
                  <h2 style={{ fontWeight: "600" }}>Đồ thị overtime </h2>
                  <div className="flex items-center">
                    <span style={{ fontSize: "12px", paddingRight: "4px" }}>
                      12 tháng gần nhất
                    </span>
                    <IoIosArrowDown />
                  </div>
                </div>
                <div className="flex px-3">
                  <div style={{ color: "rgba(30, 39, 83, 1)" }}>
                    <h2 style={{ fontWeight: "600" }}>645</h2>
                    <span style={{ fontSize: "12px", paddingRight: "4px" }}>
                      Mua khoá học
                    </span>
                  </div>
                  <div
                    className="ml-4"
                    style={{ color: "rgba(31, 210, 134, 1)" }}
                  >
                    <h2 style={{ fontWeight: "600" }}>45</h2>
                    <span style={{ fontSize: "12px", paddingRight: "4px" }}>
                      Mua đề thi
                    </span>
                  </div>
                </div>
                <div></div>
                <div className="w-full">
                  <SalesChart data={dataLine} options={optionsLine} />
                </div>
              </div>

              <div className="w-[35%] bg-white p-2 rounded-lg">
                <h2 className="text-center" style={{ fontWeight: "600" }}>
                  Đồ thị 7 ngày gần nhất
                </h2>
                <div className="flex">
                  <div style={{ color: "rgba(30, 39, 83, 1)" }}>
                    <h2 style={{ fontWeight: "600" }}>64</h2>
                    <span style={{ fontSize: "12px", paddingRight: "4px" }}>
                      Mua khoá học
                    </span>
                  </div>
                  <div
                    className="ml-4"
                    style={{ color: "rgba(31, 210, 134, 1)" }}
                  >
                    <h2 style={{ fontWeight: "600" }}>12</h2>
                    <span style={{ fontSize: "12px", paddingRight: "4px" }}>
                      Mua đề thi
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <ChartCol data={dataCol} options={optionsCol} />
                </div>
              </div>
            </div>
            {/* table */}
            <div className="flex justify-around my-3">
              <div className="w-2/5 h-[400px] bg-white rounded-lg overflow-auto">
                <h2
                  className="px-5 py-4"
                  style={{ fontWeight: "600", color: "rgba(30, 39, 83, 1)" }}
                >
                  Những khoá học bán chạy
                </h2>
                <Table columns={columnsCourse} data={dataCourse} />
              </div>
              <div className="w-2/5 h-[400px] bg-white rounded-lg overflow-auto">
                <h2
                  className="px-5 py-4"
                  style={{ fontWeight: "600", color: "rgba(30, 39, 83, 1)" }}
                >
                  Những đề thi bán chạy
                </h2>
                <Table columns={columnsExam} data={dataExam} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
