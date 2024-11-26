import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';
import Logo from '../../../assets/logoacp.jpg';

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở menu di động

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container max-w-[1228px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <img className="w-[50px] h-[50px]" src={Logo} alt="alt"/>
          <div className="text-2xl font-bold">
            <span className="text-green-500">AC</span>
            <span className="text-yellow-400">P</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-600 hover:text-sky-500 font-medium">
            Trang chủ
          </a>
          <a href="/course" className="text-gray-600 hover:text-sky-500 font-medium">
            Chương trình học
          </a>
          <a href="/exam" className="text-gray-600 hover:text-sky-500 font-medium">
            Đề thi online
          </a>
          <a href="/about" className="text-gray-600 hover:text-sky-500 font-medium">
            Về chúng tôi
          </a>
          <a href="/" className="text-gray-600 hover:text-sky-500 font-medium">
            Liên hệ
          </a>
        </nav>

        <Button onClick={() => navigate('/about')} className="hidden md:block h-[36px] rounded-[17px] bg-green-500 hover:bg-green-600">Đăng nhập</Button>

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
            <a href="#" className="text-gray-600 hover:text-sky-500 font-medium">
              Trang chủ
            </a>
            <a href="#" className="text-gray-600 hover:text-sky-500 font-medium">
              Chương trình học
            </a>
            <a href="#" className="text-gray-600 hover:text-sky-500 font-medium">
              Đề thi online
            </a>
            <a href="#" className="text-gray-600 hover:text-sky-500 font-medium">
              Về chúng tôi
            </a>
            <a href="#" className="text-gray-600 hover:text-sky-500 font-medium">
              Liên hệ
            </a>
            <Button onClick={() => navigate('/about')} className="md::hidden h-[36px] w-full rounded-[17px] bg-green-500 hover:bg-green-600">Đăng nhập</Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;