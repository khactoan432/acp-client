import React from 'react';
import Button from '../../common/Button';
import { useNavigate } from 'react-router-dom';

interface CourseProps {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  rating: number;
}

const Rating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    return index < rating ? '★' : '☆';
  }).join(' ');

  return <div className="text-yellow-500 text-2xl">{stars}</div>;
};

const Course: React.FC<CourseProps> = ({ id, name, image, price, discount, description, rating }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white max-w-[340px] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" id={id.toString()}>
      <div className="relative" onClick={() => navigate("/course/"+id)}>
        <img src={image} alt={name} className="w-full h-64 object-cover" />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>

        <div className="mt-2 flex justify-between items-center">
          <div className='flex items-center gap-4'>
            <Rating rating={rating} />
            <span>(241)</span>
          </div>
          
          <span>4279 Học viên</span>
        </div>

        <div className="flex justify-between items-center my-3">
          <div className='flex items-center gap-4'>
            <span className="text-xl font-semibold text-gray-900">{new Intl.NumberFormat('vi-VN').format(price-discount)}đ</span>
            <span className="text-xl font-medium text-gray-900 line-through">${new Intl.NumberFormat('vi-VN').format(price)}đ</span>
          </div>
        </div>
        <div className='flex gap-[10%] mt-3'>
          <Button
            onClick={() => navigate("/course/"+id)}
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

export default Course;
