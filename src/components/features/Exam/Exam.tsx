import React from 'react';
import Button from '../../common/Button';

interface ExamProps {
  id: number;
  name: string;
  image: string;
  price: number;
  time: number;
  rating: number;
  rates: number;
  problems: number;
  users: number;
}

const Exam: React.FC<ExamProps> = ({ id, name, image, price, time, rating, rates, problems, users }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" id={id.toString()}>
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
        <p className="text-sm text-gray-600 mt-2">{time} phút - {problems} problem - 16 bình luận</p>

        <div className="mt-2 flex justify-between items-center">
          <div className='flex items-center gap-1.5'>
            <span>{rating}</span>
            <span className='text-yellow-500 text-2xl'> ★ </span>
            <span>({rates} đánh giá)</span>
          </div>
          
          <span>{users} Học viên</span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className='flex items-center gap-4'>
            <span className="text-xl font-semibold text-gray-900">{price}đ</span>
            <span className="text-xl font-medium text-gray-900 line-through">${price}đ</span>
          </div>
        </div>
        <div className='flex gap-[10%] mt-3'>
          <Button
            onClick={() => alert(`Added ${name} to cart!`)}
            className='w-[45%]'
          >
            Chi tiết
          </Button>
          <Button
            onClick={() => alert(`Added ${name} to cart!`)}
            className='w-[45%]'
          >
            Mua ngay
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default Exam;
