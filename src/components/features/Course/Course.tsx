import React from 'react';
import Button from '../../common/Button';

interface CourseProps {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  rating: number;
}

const Rating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    return index < rating ? '★' : '☆';
  }).join(' ');

  return <div className="text-yellow-500 text-2xl">{stars}</div>;
};

const Course: React.FC<CourseProps> = ({ id, name, image, price, description, rating }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" id={id.toString()}>
      <div className="relative">
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

        <div className="flex justify-between items-center mt-4">
          <div className='flex items-center gap-4'>
            <span className="text-xl font-semibold text-gray-900">{price}đ</span>
            <span className="text-xl font-medium text-gray-900 line-through">${price}đ</span>
          </div>
          <Button
            onClick={() => alert(`Added ${name} to cart!`)}
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Course;
