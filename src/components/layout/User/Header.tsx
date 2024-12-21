import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { logout } from '../../../redux/slices/authSlice'; 

import Button from "../../common/Button";

import Logo from "../../../assets/logoacp.jpg";
import User from "../../../assets/user3.png";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, access_token } = useSelector((state: RootState) => state.auth);

  const isLogin = !!user && !!access_token;

  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở menu di động
  const [isUserOpen, setIsUserOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-[0_4px_4px_-4px_rgba(0,0,0,0.2)] sticky top-0 z-50">
      <div className="container max-w-[1228px] mx-auto px-4 sm:px-4 lg:px-2 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <img className="w-[50px] h-[50px]" src={Logo} alt="alt" />
          <div className="text-2xl font-bold">
            <span className="text-green-500">AC</span>
            <span className="text-yellow-400">P</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-500 hover:text-blue-600 font-semibold">
            Trang chủ
          </a>
          <a
            href="/course"
            className="text-gray-500 hover:text-blue-600 font-semibold"
          >
            Chương trình học
          </a>
          <a
            href="/exam"
            className="text-gray-500 hover:text-blue-600 font-semibold"
          >
            Đề thi online
          </a>
          <a
            href="/about"
            className="text-gray-500 hover:text-blue-600 font-semibold"
          >
            Về chúng tôi
          </a>
          <a href="/" className="text-gray-500 hover:text-blue-600 font-semibold">
            Liên hệ
          </a>
        </nav>

        {isLogin
          ?<div className="hidden md:block relative">
            {/* User Icon/Button */}
            <div className=" w-[110px] flex justify-end">
              <button
                className="flex items-center focus:outline-none"
                onClick={()=>setIsUserOpen(!isUserOpen)}
              >
                <img
                  src={User} // Replace with actual user avatar
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full bg-gray-200"
                />
                {/* <span className="ml-2 text-gray-600">
                  <i className="fa-solid fa-chevron-down">User</i>
                </span> */}
              </button>
            </div>
      
            {/* Dropdown Menu */}
            {isUserOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200">
                {/* Notification Section */}
                <div className="p-4 border-b border-gray-300">
                  <h3 className="text-gray-700 font-semibold">Thông báo</h3>
                  <p className="text-gray-500 text-sm mt-1">Bạn chưa có thông báo mới.</p>
                  <a
                    href="#"
                    className="text-blue-500 text-sm mt-1 block"
                  >
                    Xem tất cả &gt;&gt;
                  </a>
                </div>
      
                {/* Links Section */}
                <ul className="p-4 text-gray-700">
                  <li className="mb-2">
                    <a
                      href="#"
                      className="hover:text-blue-500"
                    >
                      Lịch học của tôi
                    </a>
                  </li>
                  <li className="mb-2">
                    <a
                      href="#"
                      className="hover:text-blue-500"
                    >
                      Trang cá nhân
                    </a>
                  </li>
                  <li>
                    <button
                      className="hover:text-blue-500"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          :<Button
            className="hidden md:block h-[36px] rounded-[17px]"
            onClick={()=>navigate("/login")}
          >
            Đăng nhập
          </Button>
        }   

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md px-8">
          <div className="flex flex-col items-start space-y-4 pb-4">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 font-semibold"
            >
              Trang chủ
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 font-semibold"
            >
              Chương trình học
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 font-semibold"
            >
              Đề thi online
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 font-semibold"
            >
              Về chúng tôi
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 font-semibold"
            >
              Liên hệ
            </a>
            {isLogin
              ? <Button
                  onClick={handleLogout}
                  className="md::hidden h-[36px] w-full rounded-[17px]"
                >
                  Đăng xuất
                </Button>
              : <Button
                  onClick={() => navigate("/login")}
                  className="md::hidden h-[36px] w-full rounded-[17px]"
                >
                  Đăng nhập
                </Button>
            } 
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
