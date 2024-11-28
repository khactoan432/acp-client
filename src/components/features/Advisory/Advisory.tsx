import React, { useState } from "react";
import Button from "../../common/Button";

import bg1 from "../../../assets/bg1.jpg";

const Advisory: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    course: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add logic to submit the form data to the server
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Background with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${bg1})` }}
      ></div>

      {/* Content */}
      <div className="flex items-center justify-center w-full h-full bg-opacity-90 shadow-md bg-gray-900">
        <div className="relative max-w-[700px] my-20 p-6 rounded-lg w-full bg-white">
          <h2 className="text-3xl font-bold text-center text-[#00095B] mb-2">
            Đăng ký ngay hôm nay
          </h2>
          <h2 className="text-xl font-semibold text-center text-[#00095B] mb-6">
            Nhận ưu đãi cực kỳ hấp dẫn
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            />
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="" disabled>
                Khóa học bạn quan tâm
              </option>
              <option value="frontend">Frontend Development</option>
              <option value="backend">Backend Development</option>
              <option value="fullstack">Fullstack Development</option>
              <option value="data-science">Data Science</option>
            </select>
            <Button
              type="submit"
              className="w-full py-2"
            >
              Đăng ký tư vấn miễn phí
            </Button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default Advisory;
