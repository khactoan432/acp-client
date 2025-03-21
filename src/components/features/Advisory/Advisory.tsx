import React, { useState } from "react";
import { toast } from "react-toastify";
// import component
import Button from "../../common/Button";
import Loading from "../../../components/loading";

// import axios
import { postData } from "../../../axios";

import bg1 from "../../../assets/bg1.jpg";

const Advisory: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    mindfulness_course: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await postData(
        "/api/advisories",
        {
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          mindfulness_course: formData.mindfulness_course,
        },
        { headers: {} }
      );
      toast.success("Đăng ký tư vấn thành công! Admin sẽ liên hệ sớm với bạn");
      setFormData({
        name: "",
        phone_number: "",
        email: "",
        mindfulness_course: "",
      });
    } catch (e) {
      console.error("Error submitting form:", e);
      toast.error("Đăng ký tư vấn bị lỗi, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-xl text-center text-[#00095B] mb-6">
            Nhận ưu đãi cực kỳ hấp dẫn
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            />
            <input
              type="tel"
              name="phone_number"
              placeholder="Số điện thoại"
              value={formData.phone_number}
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
              name="mindfulness_course"
              value={formData.mindfulness_course}
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
            <Button type="submit" className={`w-full py-2 relative`}>
              Đăng ký tư vấn miễn phí
              {isLoading && <Loading size="small" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Advisory;
