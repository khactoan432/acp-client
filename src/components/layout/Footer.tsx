import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

import logo from "../../assets/logoacp.jpg";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pb-4 pt-12">
      <div className="container mx-auto px-4 max-w-[1228px]">

        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div>
            {/* Logo Section */}
            <div className="pb-3">
              <div className="flex items-center pb-2">
                <div className="w-[40px] h-[32px] flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: `url(${logo})`,
                    backgroundSize: "130%", // Makes the background twice the size of the div
                    backgroundPosition: "center", // Keeps the background centered
                  }}
                >
                </div>
                <div className="text-2xl font-bold">
                  <span className="text-green-500">AC</span>
                  <span className="text-yellow-400">P</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">Advanced Competitive Programming</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 text-gray-600"><FaFacebookF size={24} /></a>
              <a href="#" className="hover:text-blue-500 text-gray-600"><FaTwitter size={24} /></a>
              <a href="#" className="hover:text-blue-500 text-gray-600"><FaInstagram size={24} /></a>
              <a href="#" className="hover:text-blue-500 text-gray-600"><FaLinkedinIn size={24} /></a>
            </div>
          </div>
          {/* About Us Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">ACP</h3>
            <ul>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Liên hệ</a></li>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Hướng dẫn sử dụng</a></li>
            </ul>
          </div>
          
          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tài nguyên</h3>
            <ul>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Các khóa học</a></li>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Thư viện đề thi</a></li>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Kho tài liệu</a></li>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Nhóm học tập</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Chính sách chung </h3>
            <ul>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Hướng dẫn thanh toán</a></li>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Điều khoản bảo mật</a></li>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-blue-500 text-gray-600">Phản hồi, khiếu nại</a></li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Thông tin doanh nghiệp</h3>
          <ul>
            <li className="text-gray-600">TRUNG TÂM TIN HỌC ACP</li>
            <li><a href="mailto:info@example.com" className="hover:text-blue-500 text-gray-600">Email: info@example.com</a></li>
            <li><a href="tel:+123456789" className="hover:text-blue-500 text-gray-600">Số điện thoại: +123 456 789</a></li>
          </ul>
        </div>
        {/* Footer Bottom */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;