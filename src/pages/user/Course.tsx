import React from 'react';

import banner from '../../assets/banner1.jpg';
import banner3 from '../../assets/banner3.jpg';
import Course from '../../components/features/Course/Course';
import Advisory from '../../components/features/Advisory/Advisory';

const UserCourse: React.FC = () => {
  const courses = [
    {
      id: 1,
      name: 'React for Beginners 1',
      description: 'Learn React from scratch with hands-on examples to get frequent.',
      image: banner,
      price: 299000,
      rating: 4,
    },
    {
      id: 2,
      name: 'Advanced JavaScript 1',
      description: 'Deep dive into JavaScript concepts and advanced features.',
      image: banner,
      price: 399000,
      rating: 5,
    },
    {
      id: 3,
      name: 'React for Beginners 2',
      description: 'Learn React from scratch with hands-on examples to get frequent.',
      image: banner,
      price: 299000,
      rating: 4,
    },
    {
      id: 4,
      name: 'Advanced JavaScript 2',
      description: 'Deep dive into JavaScript concepts and advanced features.',
      image: banner,
      price: 399000,
      rating: 5,
    },
    // Add more courses as needed
  ];

  return (
    <div>
      <div className='w-full mt-14'>
        <div className='max-w-[1228px] mx-auto'>
          <img src={banner3} alt="alt"/>
        </div>
      </div>

      <div className='max-w-[1228px] mx-auto mt-20 text-[#00095B] pb-20'>
        <p className='text-4xl font-semibold mb-2'>Chương trình học online</p>
        <p className='text-base'>Phần mềm và chương trình học online chất lượng cao của STUDY4 được thiết kế theo chương trình tiếng Anh chuẩn CEFR (A1
          -C2) của đại học Cambridge và Oxford (Anh) với hệ thống bài giảng, bài tập phong phú đa dạng. Bạn có thể học thử miễn phí trước khi đặt mua sản phẩm.</p>
        
        <div className='pt-14'>
          <p className='text-3xl font-bold pb-5'>Lớp cơ bản:</p>
          <div className='grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3'>
            {courses.map(course => (
              <div key={course.id}>
                <Course
                  id={course.id}
                  name={course.name}
                  image={course.image}
                  price={course.price}
                  description={course.description}
                  rating={course.rating}
                />
              </div>
            ))}
          </div>
        </div>

        <div className='pt-14'>
          <p className='text-3xl font-bold pb-5'>Lớp nâng cao:</p>
          <div className='grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3'>
            {courses.map(course => (
              <div key={course.id}>
                <Course
                  id={course.id}
                  name={course.name}
                  image={course.image}
                  price={course.price}
                  description={course.description}
                  rating={course.rating}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Advisory />
    </div>
  )
}

export default UserCourse